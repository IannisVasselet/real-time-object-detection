import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { initializeTensorFlow } from '../utils/tfjs-init';
import CameraControls from './CameraControls';
import SourceSelector, { VideoSource } from './SourceSelector';
import './ObjectDetector.css';

/**
 * Interface pour les détections d'objets
 */
interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

/**
 * Composant principal pour la détection d'objets en temps réel
 */
const ObjectDetector: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [sources, setSources] = useState<VideoSource[]>([]);
  const [currentSource, setCurrentSource] = useState<VideoSource | null>(null);

  useEffect(() => {
    let model: cocoSsd.ObjectDetection | null = null;
    let animationFrameId: number;
    let currentStream: MediaStream | null = null;

    /**
     * Initialise le modèle de détection d'objets
     */
    const initializeModel = async () => {
      try {
        await initializeTensorFlow();
        console.log('Chargement du modèle...');
        model = await cocoSsd.load();
        console.log('Modèle chargé avec succès');
        setIsLoading(false);
        
        if (videoRef.current && videoRef.current.readyState === 4) {
          detectObjects();
        }
      } catch (err) {
        console.error('Erreur lors du chargement du modèle:', err);
        setError('Erreur lors du chargement du modèle');
        setIsLoading(false);
      }
    };

    /**
     * Récupère la liste des caméras disponibles
     */
    const getAvailableCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(cameras);
        setHasMultipleCameras(cameras.length > 1);

        // Créer les sources webcam
        const webcamSources: VideoSource[] = cameras.map((camera, index) => ({
          id: `webcam-${index}`,
          type: 'webcam',
          name: camera.label || `Webcam ${index + 1}`,
          deviceId: camera.deviceId
        }));

        setSources(webcamSources);
        if (webcamSources.length > 0) {
          setCurrentSource(webcamSources[0]);
          setupCamera(webcamSources[0].deviceId);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des caméras:', err);
      }
    };

    /**
     * Configure la source vidéo
     */
    const setupCamera = async (deviceId?: string, url?: string) => {
      try {
        // Arrêter le flux actuel s'il existe
        if (currentStream) {
          currentStream.getTracks().forEach(track => track.stop());
        }

        if (url) {
          // Configuration pour IP cam ou drone
          if (videoRef.current) {
            videoRef.current.src = url;
            videoRef.current.onloadeddata = () => {
              if (model && !isPaused) {
                detectObjects();
              }
            };
          }
        } else if (deviceId) {
          // Configuration pour webcam
          const constraints: MediaStreamConstraints = {
            video: { 
              deviceId: { exact: deviceId },
              width: 640,
              height: 480
            }
          };

          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          currentStream = stream;
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadeddata = () => {
              if (model && !isPaused) {
                detectObjects();
              }
            };
          }
        }
      } catch (err) {
        console.error('Erreur lors de l\'accès à la source vidéo:', err);
        setError('Erreur lors de l\'accès à la source vidéo');
        setIsLoading(false);
      }
    };

    /**
     * Effectue la détection d'objets sur une frame
     */
    const detectObjects = async () => {
      if (!model || !videoRef.current || !canvasRef.current || isPaused) return;

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      try {
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const predictions = await model.detect(canvasRef.current);
        
        predictions.forEach((prediction: Detection) => {
          const [x, y, width, height] = prediction.bbox;
          const score = Math.round(prediction.score * 100);
          const hue = (score * 1.2);
          const color = `hsl(${hue}, 100%, 50%)`;
          
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
          
          ctx.fillStyle = color;
          ctx.font = 'bold 16px Inter';
          const text = `${prediction.class} (${score}%)`;
          const textWidth = ctx.measureText(text).width;
          const textHeight = 20;
          const padding = 4;
          
          ctx.fillRect(
            x,
            y > textHeight + padding ? y - textHeight - padding : y,
            textWidth + padding * 2,
            textHeight + padding * 2
          );
          
          ctx.fillStyle = '#ffffff';
          ctx.fillText(
            text,
            x + padding,
            y > textHeight + padding ? y - padding : y + textHeight + padding
          );
        });

        if (!isPaused) {
          animationFrameId = requestAnimationFrame(detectObjects);
        }
      } catch (err) {
        console.error('Erreur lors de la détection:', err);
        cancelAnimationFrame(animationFrameId);
      }
    };

    // Initialisation
    initializeModel();
    getAvailableCameras();

    // Nettoyage
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  /**
   * Gère la mise en pause/reprise de la détection
   */
  const handleTogglePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      detectObjects();
    }
  };

  /**
   * Gère le changement de caméra
   */
  const handleSwitchCamera = () => {
    const nextIndex = (currentCameraIndex + 1) % availableCameras.length;
    setCurrentCameraIndex(nextIndex);
    setupCamera(availableCameras[nextIndex].deviceId);
  };

  /**
   * Gère le changement de source vidéo
   */
  const handleSourceChange = (source: VideoSource) => {
    setCurrentSource(source);
    if (source.type === 'webcam' && source.deviceId) {
      setupCamera(source.deviceId);
    } else if (source.url) {
      setupCamera(undefined, source.url);
    }
  };

  /**
   * Gère l'ajout d'une caméra IP
   */
  const handleAddIPCamera = (url: string) => {
    const newSource: VideoSource = {
      id: `ipcam-${Date.now()}`,
      type: 'ipcam',
      name: `Caméra IP ${sources.filter(s => s.type === 'ipcam').length + 1}`,
      url
    };
    setSources(prev => [...prev, newSource]);
    handleSourceChange(newSource);
  };

  /**
   * Gère l'ajout d'un drone
   */
  const handleAddDrone = (url: string) => {
    const newSource: VideoSource = {
      id: `drone-${Date.now()}`,
      type: 'drone',
      name: `Drone ${sources.filter(s => s.type === 'drone').length + 1}`,
      url
    };
    setSources(prev => [...prev, newSource]);
    handleSourceChange(newSource);
  };

  return (
    <div className="detector-container">
      <div className="detector-header">
        <SourceSelector
          sources={sources}
          currentSource={currentSource}
          onSourceChange={handleSourceChange}
          onAddIPCamera={handleAddIPCamera}
          onAddDrone={handleAddDrone}
        />
      </div>

      {isLoading && (
        <div className="loading">
          <p>Chargement du modèle...</p>
          <p>Veuillez patienter, cela peut prendre quelques secondes.</p>
        </div>
      )}
      {error && <div className="error">{error}</div>}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ display: 'none' }}
        width={640}
        height={480}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
      />
      <CameraControls
        onTogglePause={handleTogglePause}
        onSwitchCamera={handleSwitchCamera}
        isPaused={isPaused}
        hasMultipleCameras={hasMultipleCameras}
      />
    </div>
  );
};

export default ObjectDetector; 