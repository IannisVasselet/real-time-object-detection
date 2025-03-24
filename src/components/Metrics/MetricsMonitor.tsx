import React, { useEffect, useState, useRef } from 'react';
import { PerformanceMetrics, FPSCounter, collectMetrics } from '../../utils/metrics';
import './MetricsMonitor.css';

/**
 * Interface pour les métriques avec animation
 */
interface AnimatedMetric {
  value: number;
  isChanging: boolean;
}

/**
 * Interface pour les métriques animées
 */
interface AnimatedMetrics {
  fps: AnimatedMetric;
  map: AnimatedMetric;
  memory: AnimatedMetric;
  cpu: AnimatedMetric;
  gpu?: AnimatedMetric;
}

/**
 * Composant pour afficher les métriques en temps réel de la détection d'objets
 * @returns {JSX.Element} Le composant MetricsMonitor
 */
const MetricsMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<AnimatedMetrics>({
    fps: { value: 0, isChanging: false },
    map: { value: 0, isChanging: false },
    memory: { value: 0, isChanging: false },
    cpu: { value: 0, isChanging: false },
  });
  
  const fpsCounter = useRef(new FPSCounter());
  const lastUpdate = useRef(performance.now());
  const previousMetrics = useRef<PerformanceMetrics>({
    fps: 0,
    map: 0,
    memory: 0,
    cpu: 0,
  });

  /**
   * Met à jour les métriques en temps réel
   */
  useEffect(() => {
    const updateMetrics = async () => {
      try {
        const now = performance.now();
        const delta = now - lastUpdate.current;
        
        // Mise à jour des FPS
        const currentFPS = fpsCounter.current.update();
        
        // Mise à jour des autres métriques toutes les secondes
        if (delta >= 1000) {
          const systemMetrics = await collectMetrics();
          
          // Mise à jour des métriques avec animation
          setMetrics(prev => {
            const newMetrics: AnimatedMetrics = {
              fps: {
                value: currentFPS,
                isChanging: currentFPS !== previousMetrics.current.fps
              },
              map: {
                value: systemMetrics.map,
                isChanging: systemMetrics.map !== previousMetrics.current.map
              },
              memory: {
                value: systemMetrics.memory,
                isChanging: systemMetrics.memory !== previousMetrics.current.memory
              },
              cpu: {
                value: systemMetrics.cpu,
                isChanging: systemMetrics.cpu !== previousMetrics.current.cpu
              }
            };

            if (systemMetrics.gpu) {
              newMetrics.gpu = {
                value: systemMetrics.gpu,
                isChanging: systemMetrics.gpu !== previousMetrics.current.gpu
              };
            }

            previousMetrics.current = {
              fps: currentFPS,
              ...systemMetrics
            };

            return newMetrics;
          });

          lastUpdate.current = now;
        } else {
          // Mise à jour uniquement des FPS
          setMetrics(prev => ({
            ...prev,
            fps: {
              value: currentFPS,
              isChanging: currentFPS !== previousMetrics.current.fps
            }
          }));
        }
      } catch (error) {
        console.error('Erreur lors de la collecte des métriques:', error);
      }
    };

    const interval = setInterval(updateMetrics, 100);
    return () => {
      clearInterval(interval);
      fpsCounter.current.reset();
    };
  }, []);

  /**
   * Rendu d'une carte de métrique
   */
  const renderMetricCard = (label: string, metric: AnimatedMetric) => (
    <div className="metric-card">
      <span className="metric-label">{label}</span>
      <span className={`metric-value ${metric.isChanging ? 'changed' : ''}`}>
        {metric.value}
      </span>
    </div>
  );

  return (
    <div className="metrics-container">
      <h3>Métriques en Temps Réel</h3>
      <div className="metrics-grid">
        {renderMetricCard('FPS', metrics.fps)}
        {renderMetricCard('mAP', metrics.map)}
        {renderMetricCard('Mémoire (MB)', metrics.memory)}
        {renderMetricCard('CPU (%)', metrics.cpu)}
        {metrics.gpu && renderMetricCard('GPU (%)', metrics.gpu)}
      </div>
    </div>
  );
};

export default MetricsMonitor; 