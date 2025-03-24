import React, { useState } from 'react';
import './SourceSelector.css';

export interface VideoSource {
  id: string;
  type: 'webcam' | 'ipcam' | 'drone';
  name: string;
  url?: string;
  deviceId?: string;
}

interface SourceSelectorProps {
  sources: VideoSource[];
  currentSource: VideoSource | null;
  onSourceChange: (source: VideoSource) => void;
  onAddIPCamera: (url: string) => void;
  onAddDrone: (url: string) => void;
}

/**
 * Composant pour sélectionner la source vidéo
 * @param {SourceSelectorProps} props - Les propriétés du composant
 */
const SourceSelector: React.FC<SourceSelectorProps> = ({
  sources,
  currentSource,
  onSourceChange,
  onAddIPCamera,
  onAddDrone
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newIPCameraUrl, setNewIPCameraUrl] = useState('');
  const [newDroneUrl, setNewDroneUrl] = useState('');
  const [showIPCameraForm, setShowIPCameraForm] = useState(false);
  const [showDroneForm, setShowDroneForm] = useState(false);

  /**
   * Gère l'ajout d'une nouvelle caméra IP
   */
  const handleAddIPCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIPCameraUrl) {
      onAddIPCamera(newIPCameraUrl);
      setNewIPCameraUrl('');
      setShowIPCameraForm(false);
    }
  };

  /**
   * Gère l'ajout d'un nouveau drone
   */
  const handleAddDrone = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDroneUrl) {
      onAddDrone(newDroneUrl);
      setNewDroneUrl('');
      setShowDroneForm(false);
    }
  };

  return (
    <div className="source-selector">
      <div className="source-selector-header">
        <button 
          className="source-selector-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="source-selector-label">
            {currentSource ? currentSource.name : 'Sélectionner une source'}
          </span>
          <span className={`source-selector-arrow ${isOpen ? 'open' : ''}`}>▼</span>
        </button>
      </div>

      {isOpen && (
        <div className="source-selector-menu">
          {sources.map((source) => (
            <button
              key={source.id}
              className={`source-option ${currentSource?.id === source.id ? 'active' : ''}`}
              onClick={() => {
                onSourceChange(source);
                setIsOpen(false);
              }}
            >
              <span className="source-icon">
                {source.type === 'webcam' && '📹'}
                {source.type === 'ipcam' && '🌐'}
                {source.type === 'drone' && '🚁'}
              </span>
              {source.name}
            </button>
          ))}

          <div className="source-selector-actions">
            <button
              className="source-action-button"
              onClick={() => setShowIPCameraForm(!showIPCameraForm)}
            >
              + Ajouter une caméra IP
            </button>
            <button
              className="source-action-button"
              onClick={() => setShowDroneForm(!showDroneForm)}
            >
              + Ajouter un drone
            </button>
          </div>

          {showIPCameraForm && (
            <form onSubmit={handleAddIPCamera} className="source-form">
              <input
                type="url"
                placeholder="URL de la caméra IP"
                value={newIPCameraUrl}
                onChange={(e) => setNewIPCameraUrl(e.target.value)}
                className="source-input"
              />
              <button type="submit" className="source-submit">Ajouter</button>
            </form>
          )}

          {showDroneForm && (
            <form onSubmit={handleAddDrone} className="source-form">
              <input
                type="url"
                placeholder="URL du flux du drone"
                value={newDroneUrl}
                onChange={(e) => setNewDroneUrl(e.target.value)}
                className="source-input"
              />
              <button type="submit" className="source-submit">Ajouter</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default SourceSelector; 