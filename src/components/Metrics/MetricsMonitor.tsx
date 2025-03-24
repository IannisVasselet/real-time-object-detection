import React, { useEffect, useState, useRef } from 'react';
import { PerformanceMetrics, FPSCounter, collectMetrics } from '../../utils/metrics';
import './MetricsMonitor.css';

/**
 * Composant pour afficher les métriques en temps réel de la détection d'objets
 * @returns {JSX.Element} Le composant MetricsMonitor
 */
const MetricsMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    map: 0,
    memory: 0,
    cpu: 0,
  });
  
  const fpsCounter = useRef(new FPSCounter());
  const lastUpdate = useRef(performance.now());

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
          setMetrics({
            ...systemMetrics,
            fps: currentFPS,
          });
          lastUpdate.current = now;
        } else {
          // Mise à jour uniquement des FPS
          setMetrics(prev => ({
            ...prev,
            fps: currentFPS,
          }));
        }
      } catch (error) {
        console.error('Erreur lors de la collecte des métriques:', error);
      }
    };

    const interval = setInterval(updateMetrics, 100); // Mise à jour plus fréquente pour les FPS
    return () => {
      clearInterval(interval);
      fpsCounter.current.reset();
    };
  }, []);

  return (
    <div className="metrics-container">
      <h3>Métriques en Temps Réel</h3>
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">FPS</span>
          <span className="metric-value">{metrics.fps}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">mAP</span>
          <span className="metric-value">{metrics.map}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Mémoire (MB)</span>
          <span className="metric-value">{metrics.memory}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">CPU (%)</span>
          <span className="metric-value">{metrics.cpu}</span>
        </div>
        {metrics.gpu && (
          <div className="metric-card">
            <span className="metric-label">GPU (%)</span>
            <span className="metric-value">{metrics.gpu}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsMonitor; 