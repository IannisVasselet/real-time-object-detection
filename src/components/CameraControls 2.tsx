import React from 'react';
import './CameraControls.css';

interface CameraControlsProps {
  onTogglePause: () => void;
  onSwitchCamera: () => void;
  isPaused: boolean;
  hasMultipleCameras: boolean;
}

/**
 * Composant pour les contrôles de la caméra
 * @param {CameraControlsProps} props - Les propriétés du composant
 */
const CameraControls: React.FC<CameraControlsProps> = ({
  onTogglePause,
  onSwitchCamera,
  isPaused,
  hasMultipleCameras
}) => {
  return (
    <div className="camera-controls">
      <button 
        className="control-button"
        onClick={onTogglePause}
        title={isPaused ? "Reprendre" : "Mettre en pause"}
      >
        {isPaused ? "▶️" : "⏸️"}
      </button>
      
      {hasMultipleCameras && (
        <button 
          className="control-button"
          onClick={onSwitchCamera}
          title="Changer de caméra"
        >
          🔄
        </button>
      )}
    </div>
  );
};

export default CameraControls; 