import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as blazeface from '@tensorflow-models/blazeface';
import { ModelInfo } from '../components/ModelSelector';

/**
 * Service pour gérer les modèles de détection d'objets
 */
class ModelService {
  private static instance: ModelService;
  private currentModel: any = null;
  private modelInfo: ModelInfo[] = [
    {
      id: 'coco-ssd',
      name: 'COCO-SSD',
      description: 'Modèle SSD optimisé pour la détection d\'objets en temps réel',
      version: '2.2.3',
      size: '~50MB',
      speed: 'Rapide',
      accuracy: '85%',
      supportedClasses: 80,
      license: 'Apache 2.0',
      category: 'Détection d\'objets'
    },
    {
      id: 'mobilenet',
      name: 'MobileNet',
      description: 'Modèle léger optimisé pour la classification d\'images',
      version: '2.0.0',
      size: '~20MB',
      speed: 'Très rapide',
      accuracy: '80%',
      supportedClasses: 1000,
      license: 'Apache 2.0',
      category: 'Classification'
    },
    {
      id: 'blazeface',
      name: 'BlazeFace',
      description: 'Modèle ultra-léger pour la détection de visages',
      version: '1.0.0',
      size: '~5MB',
      speed: 'Ultra rapide',
      accuracy: '95%',
      supportedClasses: 1,
      license: 'Apache 2.0',
      category: 'Détection de visages'
    }
  ];

  private constructor() {}

  /**
   * Récupère l'instance unique du service
   */
  public static getInstance(): ModelService {
    if (!ModelService.instance) {
      ModelService.instance = new ModelService();
    }
    return ModelService.instance;
  }

  /**
   * Récupère la liste des modèles disponibles
   */
  public getAvailableModels(): ModelInfo[] {
    return this.modelInfo;
  }

  /**
   * Charge un modèle spécifique
   * @param modelId - L'identifiant du modèle à charger
   */
  public async loadModel(modelId: string): Promise<void> {
    try {
      console.log(`Chargement du modèle ${modelId}...`);
      
      // Libérer les ressources du modèle actuel
      await this.disposeModel();

      switch (modelId) {
        case 'coco-ssd':
          this.currentModel = await cocoSsd.load();
          break;
        case 'mobilenet':
          this.currentModel = await mobilenet.load();
          break;
        case 'blazeface':
          this.currentModel = await blazeface.load();
          break;
        default:
          throw new Error(`Modèle ${modelId} non supporté`);
      }

      console.log(`Modèle ${modelId} chargé avec succès`);
    } catch (error) {
      console.error(`Erreur lors du chargement du modèle ${modelId}:`, error);
      throw error;
    }
  }

  /**
   * Libère les ressources du modèle actuel
   */
  public async disposeModel(): Promise<void> {
    if (this.currentModel) {
      try {
        // Libérer la mémoire GPU si disponible
        if (tf.getBackend() === 'webgl') {
          await tf.engine().reset();
        }
        this.currentModel = null;
      } catch (error) {
        console.error('Erreur lors de la libération du modèle:', error);
      }
    }
  }

  /**
   * Effectue la détection d'objets sur une image
   * @param image - L'élément image ou canvas à analyser
   */
  public async detect(image: HTMLImageElement | HTMLCanvasElement): Promise<any[]> {
    if (!this.currentModel) {
      throw new Error('Aucun modèle chargé');
    }

    try {
      let predictions;
      
      // Adapter le format des prédictions selon le modèle
      if (this.currentModel.detect) {
        predictions = await this.currentModel.detect(image);
      } else if (this.currentModel.classify) {
        const classifications = await this.currentModel.classify(image);
        predictions = classifications.map((pred: any) => ({
          bbox: [0, 0, image.width, image.height], // Bounding box pour toute l'image
          class: pred.className,
          score: pred.probability
        }));
      }

      // Normaliser le format des prédictions
      return predictions.map((pred: any) => ({
        bbox: Array.isArray(pred.bbox) ? pred.bbox : [0, 0, image.width, image.height],
        class: pred.class || pred.className || 'Objet',
        score: pred.score || pred.probability || 1
      }));
    } catch (error) {
      console.error('Erreur lors de la détection:', error);
      throw error;
    }
  }
}

export default ModelService; 