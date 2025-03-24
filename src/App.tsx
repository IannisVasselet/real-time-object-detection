import React from 'react';
import ObjectDetector from './components/ObjectDetector';
import MetricsMonitor from './components/Metrics/MetricsMonitor';
import './styles/global.css';
import './App.css';

/**
 * Composant principal de l'application
 */
const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header glass-effect">
        <div className="header-content">
          <h1 className="title">Détection d'Objets en Temps Réel</h1>
          <p className="subtitle">Utilisez votre webcam pour détecter des objets en temps réel</p>
        </div>
      </header>
      
      <main className="app-main">
        <div className="detector-wrapper card">
          <ObjectDetector />
        </div>
        <MetricsMonitor />
      </main>
      
      <footer className="app-footer glass-effect">
        <div className="footer-content">
          <p>Développé avec React, TensorFlow.js et COCO-SSD</p>
          <div className="tech-stack">
            <span className="tech-badge">React</span>
            <span className="tech-badge">TensorFlow.js</span>
            <span className="tech-badge">COCO-SSD</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App; 