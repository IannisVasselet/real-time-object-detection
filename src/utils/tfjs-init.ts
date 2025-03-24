import * as tf from '@tensorflow/tfjs';

/**
 * Initialise TensorFlow.js avec le backend WebGL
 */
export const initializeTensorFlow = async (): Promise<void> => {
  try {
    // Vérifie si le backend WebGL est disponible
    if (tf.findBackend('webgl')) {
      console.log('Backend WebGL trouvé');
      await tf.setBackend('webgl');
      await tf.ready();
      
      // Configure les paramètres de WebGL pour de meilleures performances
      const gl = (tf.backend() as any).gpgpu.gl;
      if (gl) {
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.STENCIL_TEST);
        gl.disable(gl.BLEND);
        gl.disable(gl.DITHER);
        gl.disable(gl.POLYGON_OFFSET_FILL);
        gl.disable(gl.SAMPLE_COVERAGE);
        gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
      }
      
      console.log('TensorFlow.js initialisé avec succès avec le backend WebGL');
    } else {
      console.warn('Backend WebGL non disponible, utilisation du backend CPU');
      await tf.setBackend('cpu');
      await tf.ready();
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de TensorFlow.js:', error);
    throw error;
  }
}; 