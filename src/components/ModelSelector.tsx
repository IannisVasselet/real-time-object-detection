import React, { useState, useMemo } from 'react';
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
  category: string;
}

interface ModelSelectorProps {
  models: ModelInfo[];
  currentModel: ModelInfo | null;
  onModelChange: (model: ModelInfo) => void;
  isLoading: boolean;
}

/**
 * Convertit la vitesse en valeur numérique pour le tri
 */
const getSpeedValue = (speed: string): number => {
  switch (speed.toLowerCase()) {
    case 'ultra rapide': return 4;
    case 'très rapide': return 3;
    case 'rapide': return 2;
    case 'moyenne': return 1;
    case 'lente': return 0;
    default: return -1;
  }
};

/**
 * Convertit la taille en valeur numérique pour le tri
 */
const getSizeValue = (size: string): number => {
  return parseFloat(size.replace(/[^0-9.]/g, ''));
};

/**
 * Composant pour la sélection des modèles de détection
 */
const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  currentModel,
  onModelChange,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'speed' | 'accuracy' | 'size'>('speed');

  // Catégories disponibles
  const categories = useMemo(() => {
    const cats = new Set(models.map(model => model.category));
    return ['all', ...Array.from(cats)];
  }, [models]);

  // Filtrer et trier les modèles
  const filteredModels = useMemo(() => {
    return models
      .filter(model => {
        const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            model.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'speed':
            return getSpeedValue(b.speed) - getSpeedValue(a.speed);
          case 'accuracy':
            return parseFloat(b.accuracy) - parseFloat(a.accuracy);
          case 'size':
            return getSizeValue(a.size) - getSizeValue(b.size);
          default:
            return 0;
        }
      });
  }, [models, searchTerm, selectedCategory, sortBy]);

  // Filtrer les modèles pour exclure le modèle actuel de la liste
  const availableModels = useMemo(() => {
    return filteredModels.filter(model => model.id !== currentModel?.id);
  }, [filteredModels, currentModel]);

  return (
    <div className="model-selector">
      <div className="model-selector-header">
        <h2>Modèle de Détection</h2>
        <div className="model-filters">
          <input
            type="text"
            placeholder="Rechercher un modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="model-search"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="model-category-filter"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Toutes les catégories' : category}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'speed' | 'accuracy' | 'size')}
            className="model-sort"
          >
            <option value="speed">Trier par vitesse</option>
            <option value="accuracy">Trier par précision</option>
            <option value="size">Trier par taille</option>
          </select>
        </div>
      </div>

      {currentModel && (
        <div className="current-model">
          <h3>Modèle Actuel</h3>
          <div className="model-card active">
            <div className="model-header">
              <h4>{currentModel.name}</h4>
              <span className="model-version">v{currentModel.version}</span>
            </div>
            <p className="model-description">{currentModel.description}</p>
            <div className="model-stats">
              <div className="stat">
                <span className="stat-label">Vitesse</span>
                <span className="stat-value">{currentModel.speed}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Précision</span>
                <span className="stat-value">{currentModel.accuracy}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Taille</span>
                <span className="stat-value">{currentModel.size}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Classes</span>
                <span className="stat-value">{currentModel.supportedClasses}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="model-grid">
        {availableModels.map((model) => (
          <div
            key={model.id}
            className={`model-card ${isLoading ? 'disabled' : ''}`}
            onClick={() => !isLoading && onModelChange(model)}
          >
            <div className="model-header">
              <h4>{model.name}</h4>
              <span className="model-version">v{model.version}</span>
            </div>
            <p className="model-description">{model.description}</p>
            <div className="model-stats">
              <div className="stat">
                <span className="stat-label">Vitesse</span>
                <span className="stat-value">{model.speed}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Précision</span>
                <span className="stat-value">{model.accuracy}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Taille</span>
                <span className="stat-value">{model.size}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Classes</span>
                <span className="stat-value">{model.supportedClasses}</span>
              </div>
            </div>
            <div className="model-footer">
              <span className="model-license">{model.license}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector; 