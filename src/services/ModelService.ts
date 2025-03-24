import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
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
      description: 'Modèle de détection d\'objets basé sur SSD (Single Shot Detector) pré-entraîné sur le dataset COCO.',
      version: '2.2.3',
      size: '~20MB',
      speed: 'Rapide',
      accuracy: '85%',
      supportedClasses: 80,
      license: 'Apache 2.0'
    },
    {
      id: 'yolov9',
      name: 'YOLOv9',
      description: 'Version améliorée de YOLO (You Only Look Once) avec une meilleure précision et vitesse.',
      version: '1.0.0',
      size: '~50MB',
      speed: 'Très rapide',
      accuracy: '92%',
      supportedClasses: 80,
      license: 'MIT'
    },
    {
      id: 'efficientdet',
      name: 'EfficientDet',
      description: 'Modèle de détection basé sur EfficientNet avec une excellente précision.',
      version: '1.0.0',
      size: '~40MB',
      speed: 'Moyenne',
      accuracy: '90%',
      supportedClasses: 90,
      license: 'Apache 2.0'
    },
    {
      id: 'detr',
      name: 'DETR',
      description: 'Modèle de détection basé sur les transformers avec une précision exceptionnelle.',
      version: '1.0.0',
      size: '~60MB',
      speed: 'Lente',
      accuracy: '95%',
      supportedClasses: 91,
      license: 'Apache 2.0'
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
  public async loadModel(modelId: string): Promise<any> {
    try {
      // Arrêter le modèle actuel s'il existe
      if (this.currentModel) {
        await this.disposeModel();
      }

      console.log(`Chargement du modèle ${modelId}...`);
      
      switch (modelId) {
        case 'coco-ssd':
          this.currentModel = await cocoSsd.load();
          break;
        case 'yolov9':
          // TODO: Implémenter le chargement de YOLOv9
          throw new Error('YOLOv9 non implémenté');
        case 'efficientdet':
          // TODO: Implémenter le chargement de EfficientDet
          throw new Error('EfficientDet non implémenté');
        case 'detr':
          // TODO: Implémenter le chargement de DETR
          throw new Error('DETR non implémenté');
        default:
          throw new Error(`Modèle ${modelId} non supporté`);
      }

      console.log(`Modèle ${modelId} chargé avec succès`);
      return this.currentModel;
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
        // Libérer la mémoire GPU si nécessaire
        await tf.dispose(this.currentModel);
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
      return await this.currentModel.detect(image);
    } catch (error) {
      console.error('Erreur lors de la détection:', error);
      throw error;
    }
  }
}

export default ModelService; 