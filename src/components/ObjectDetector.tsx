import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { initializeTensorFlow } from '../utils/tfjs-init';

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

  useEffect(() => {
    let model: cocoSsd.ObjectDetection | null = null;
    let animationFrameId: number;

    /**
     * Initialise le modèle de détection d'objets
     */
    const initializeModel = async () => {
      try {
        // Initialise TensorFlow.js
        await initializeTensorFlow();
        
        console.log('Chargement du modèle...');
        model = await cocoSsd.load();
        console.log('Modèle chargé avec succès');
        setIsLoading(false);
        
        // Démarrer la détection une fois le modèle chargé
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
     * Configure la webcam
     */
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640,
            height: 480,
            facingMode: 'environment' // Utilise la caméra arrière si disponible
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => {
            // Démarrer la détection une fois la vidéo chargée et si le modèle est prêt
            if (model) {
              detectObjects();
            }
          };
        }
      } catch (err) {
        console.error('Erreur lors de l\'accès à la webcam:', err);
        setError('Erreur lors de l\'accès à la webcam');
        setIsLoading(false);
      }
    };

    /**
     * Effectue la détection d'objets sur une frame
     */
    const detectObjects = async () => {
      if (!model || !videoRef.current || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      try {
        // Dessine la frame vidéo sur le canvas
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        // Effectue la détection
        const predictions = await model.detect(canvasRef.current);
        
        // Dessine les boîtes de détection
        predictions.forEach((prediction: Detection) => {
          const [x, y, width, height] = prediction.bbox;
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
          
          ctx.fillStyle = '#00ff00';
          ctx.font = '16px Arial';
          ctx.fillText(
            `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
            x,
            y > 10 ? y - 5 : 10
          );
        });

        // Continue la boucle de détection
        animationFrameId = requestAnimationFrame(detectObjects);
      } catch (err) {
        console.error('Erreur lors de la détection:', err);
        cancelAnimationFrame(animationFrameId);
      }
    };

    // Initialisation
    initializeModel();
    setupCamera();

    // Nettoyage
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="detector-container">
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
        style={{ border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default ObjectDetector; 