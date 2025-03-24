import React, { useState, useRef, useEffect } from 'react';
import './SourceSelector.css';

export interface VideoSource {
  id: string;
  name: string;
  type: 'webcam' | 'ipcam' | 'drone';
  url?: string;
  deviceId?: string;
  icon: string;
}

interface SourceSelectorProps {
  sources: VideoSource[];
  currentSource: VideoSource | null;
  onSourceChange: (source: VideoSource) => void;
  onAddSource: (source: Omit<VideoSource, 'id'>) => void;
}

/**
 * Composant pour sélectionner et gérer les sources vidéo
 */
export const SourceSelector: React.FC<SourceSelectorProps> = ({
  sources,
  currentSource,
  onSourceChange,
  onAddSource,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceType, setNewSourceType] = useState<'ipcam' | 'drone'>('ipcam');
  const selectorRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAddingSource(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSourceSelect = (source: VideoSource) => {
    onSourceChange(source);
    setIsOpen(false);
  };

  const handleAddSource = () => {
    if (newSourceUrl.trim()) {
      onAddSource({
        name: `${newSourceType === 'ipcam' ? 'IP Camera' : 'Drone'} ${sources.length + 1}`,
        type: newSourceType,
        url: newSourceUrl,
        icon: newSourceType === 'ipcam' ? '📹' : '🚁',
      });
      setNewSourceUrl('');
      setIsAddingSource(false);
    }
  };

  return (
    <div className="source-selector" ref={selectorRef}>
      <div className="source-selector-header">
        <button
          className="source-selector-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>
            {currentSource ? (
              <>
                {currentSource.icon} {currentSource.name}
              </>
            ) : (
              'Sélectionner une source'
            )}
          </span>
          <span className={`source-selector-arrow ${isOpen ? 'open' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="source-selector-menu">
          {sources.map((source) => (
            <button
              key={source.id}
              className={`source-option ${currentSource?.id === source.id ? 'active' : ''}`}
              onClick={() => handleSourceSelect(source)}
            >
              <span className="source-icon">{source.icon}</span>
              {source.name}
            </button>
          ))}

          <div className="source-selector-actions">
            {!isAddingSource ? (
              <button
                className="source-action-button"
                onClick={() => setIsAddingSource(true)}
              >
                + Ajouter une source
              </button>
            ) : (
              <div className="source-form">
                <select
                  className="source-input"
                  value={newSourceType}
                  onChange={(e) => setNewSourceType(e.target.value as 'ipcam' | 'drone')}
                >
                  <option value="ipcam">IP Camera</option>
                  <option value="drone">Drone</option>
                </select>
                <input
                  type="text"
                  className="source-input"
                  placeholder="URL de la source"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                />
                <button className="source-submit" onClick={handleAddSource}>
                  Ajouter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 