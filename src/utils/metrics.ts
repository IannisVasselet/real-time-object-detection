import * as tf from '@tensorflow/tfjs';

/**
 * Interface pour les métriques de performance
 */
export interface PerformanceMetrics {
  fps: number;
  map: number;
  memory: number;
  cpu: number;
  gpu?: number;
}

/**
 * Calcule le FPS en utilisant une moyenne mobile
 */
export class FPSCounter {
  private frames: number[] = [];
  private lastTime: number = performance.now();
  private readonly maxSamples: number = 30; // Réduit pour une réponse plus rapide
  private frameCount: number = 0;
  private lastFPSUpdate: number = performance.now();

  /**
   * Met à jour le compteur de FPS
   * @returns {number} Le FPS actuel
   */
  update(): number {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    this.frameCount++;

    // Mise à jour des FPS chaque seconde
    if (now - this.lastFPSUpdate >= 1000) {
      const currentFPS = (this.frameCount * 1000) / (now - this.lastFPSUpdate);
      this.frames.push(currentFPS);
      
      if (this.frames.length > this.maxSamples) {
        this.frames.shift();
      }

      this.frameCount = 0;
      this.lastFPSUpdate = now;
    }

    // Calcul de la moyenne des FPS
    if (this.frames.length === 0) return 0;
    const averageFPS = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    return Math.round(averageFPS);
  }

  /**
   * Réinitialise le compteur
   */
  reset(): void {
    this.frames = [];
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.lastFPSUpdate = performance.now();
  }
}

/**
 * Collecte les métriques de performance système
 * @returns {Promise<PerformanceMetrics>} Les métriques actuelles
 */
export async function collectMetrics(): Promise<PerformanceMetrics> {
  const metrics: PerformanceMetrics = {
    fps: 0,
    map: 0,
    memory: 0,
    cpu: 0,
  };

  // Collecte des métriques TensorFlow.js
  const tfMemory = tf.memory();
  metrics.memory = Math.round(tfMemory.numBytes / (1024 * 1024)); // Conversion en MB

  // TODO: Implémenter la collecte des métriques CPU et GPU
  // Pour l'instant, on utilise des valeurs simulées
  metrics.cpu = Math.round(Math.random() * 50 + 20);
  if (tf.getBackend() === 'webgl') {
    metrics.gpu = Math.round(Math.random() * 30 + 10);
  }

  return metrics;
}

/**
 * Calcule le mAP (mean Average Precision) pour les détections
 * @param {Array} predictions - Les prédictions du modèle
 * @param {Array} groundTruth - Les vérités terrain
 * @returns {number} Le score mAP
 */
export function calculateMAP(predictions: any[], groundTruth: any[]): number {
  // TODO: Implémenter le calcul du mAP
  // Pour l'instant, on retourne une valeur simulée
  return Number((Math.random() * 0.5 + 0.5).toFixed(2));
} 