import React from 'react';
import ObjectDetector from './components/ObjectDetector';
import './App.css';

/**
 * Composant principal de l'application
 */
const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Détection d'Objets en Temps Réel</h1>
        <p>Utilisez votre webcam pour détecter des objets en temps réel</p>
      </header>
      <main className="app-main">
        <ObjectDetector />
      </main>
      <footer className="app-footer">
        <p>Développé avec React, TensorFlow.js et COCO-SSD</p>
      </footer>
    </div>
  );
};

export default App; 