import React from 'react';
import './ModelSelector.css';

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  size: string;
  speed: string;
  accuracy: string;
  supportedClasses: number;
  license: string;
}

interface ModelSelectorProps {
  models: ModelInfo[];
  currentModel: ModelInfo | null;
  onModelChange: (model: ModelInfo) => void;
  isLoading: boolean;
}

/**
 * Composant pour sélectionner le modèle de détection
 * @param {ModelSelectorProps} props - Les propriétés du composant
 */
const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  currentModel,
  onModelChange,
  isLoading
}) => {
  return (
    <div className="model-selector">
      <div className="model-selector-header">
        <h3>Modèle de détection</h3>
        <div className="model-selector-current">
          {currentModel ? (
            <div className="current-model-info">
              <span className="model-name">{currentModel.name}</span>
              <span className="model-version">v{currentModel.version}</span>
            </div>
          ) : (
            <span className="model-placeholder">Sélectionner un modèle</span>
          )}
        </div>
      </div>

      <div className="model-grid">
        {models.map((model) => (
          <div
            key={model.id}
            className={`model-card ${currentModel?.id === model.id ? 'active' : ''} ${isLoading ? 'disabled' : ''}`}
            onClick={() => !isLoading && onModelChange(model)}
          >
            <div className="model-card-header">
              <h4>{model.name}</h4>
              <span className="model-version">v{model.version}</span>
            </div>
            
            <p className="model-description">{model.description}</p>
            
            <div className="model-stats">
              <div className="stat-item">
                <span className="stat-label">Taille</span>
                <span className="stat-value">{model.size}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Vitesse</span>
                <span className="stat-value">{model.speed}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Précision</span>
                <span className="stat-value">{model.accuracy}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Classes</span>
                <span className="stat-value">{model.supportedClasses}</span>
              </div>
            </div>

            <div className="model-footer">
              <span className="model-license">{model.license}</span>
              {currentModel?.id === model.id && (
                <span className="model-status">En cours d'utilisation</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector; 