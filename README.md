# Système de Reconnaissance d'Objets en Temps Réel

Ce projet implémente un système de reconnaissance d'objets en temps réel utilisant l'apprentissage profond et la vision par ordinateur. Il permet de détecter et d'identifier des objets dans un flux vidéo en direct via la webcam.

## 🚀 Fonctionnalités

- Détection d'objets en temps réel via webcam
- Classification multi-objets (plus de 80 classes d'objets)
- Interface utilisateur moderne et réactive
- Optimisation des performances avec WebGL
- Affichage des boîtes englobantes avec scores de confiance

## 🛠️ Technologies Utilisées

- **Frontend**:
  - React.js avec TypeScript
  - Vite pour le build et le développement
  - CSS moderne avec Flexbox

- **Intelligence Artificielle**:
  - TensorFlow.js pour l'inférence en temps réel
  - COCO-SSD pour la détection d'objets
  - WebGL pour l'accélération matérielle

- **Outils de Développement**:
  - TypeScript pour le typage statique
  - ESLint pour la qualité du code
  - Prettier pour le formatage

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- Navigateur moderne avec support WebGL
- Webcam fonctionnelle

## 🚀 Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/real-time-object-detection.git
cd real-time-object-detection
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez le serveur de développement :
```bash
npm run dev
```

4. Ouvrez votre navigateur à l'adresse : `http://localhost:3000`

## 🏗️ Architecture du Projet

```
real_time_object_detection/
├── src/
│   ├── components/     # Composants React
│   │   └── ObjectDetector.tsx  # Composant principal de détection
│   ├── utils/         # Utilitaires
│   │   └── tfjs-init.ts       # Initialisation de TensorFlow.js
│   ├── App.tsx        # Composant racine
│   └── main.tsx       # Point d'entrée
├── public/            # Fichiers statiques
└── tests/             # Tests unitaires
```

## 🔧 Configuration

Le projet utilise plusieurs fichiers de configuration :

- `vite.config.ts` : Configuration de Vite
- `tsconfig.json` : Configuration TypeScript
- `package.json` : Dépendances et scripts

## 🤖 Fonctionnement

1. **Initialisation** :
   - Chargement du modèle COCO-SSD
   - Configuration du backend WebGL
   - Activation de la webcam

2. **Détection** :
   - Capture des frames vidéo
   - Analyse avec le modèle COCO-SSD
   - Affichage des résultats en temps réel

3. **Optimisation** :
   - Utilisation de WebGL pour l'accélération
   - Gestion efficace de la mémoire
   - Optimisation des performances

## 📊 Performance

- Détection en temps réel (30+ FPS sur GPU)
- Faible latence (< 100ms)
- Optimisation pour les appareils mobiles

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [TensorFlow.js](https://www.tensorflow.org/js)
- [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)

## 📞 Support

Pour toute question ou problème, n'hésitez pas à ouvrir une issue sur GitHub. 