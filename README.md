# HOA PDF to Text Converter

Un outil simple pour convertir des fichiers PDF en texte brut.

## Installation

```bash
npm install
```

## Démarrage

```bash
node index.js
```

Le serveur démarre sur http://localhost:3001

## Utilisation

1. Ouvrez http://localhost:3001 dans votre navigateur
2. Sélectionnez un fichier PDF
3. Cliquez sur "Convertir en texte"
4. Le texte extrait s'affichera dans la zone de texte

## API

**POST** `/pdf2text`
- Content-Type: `multipart/form-data`
- Corps : fichier PDF dans le champ `pdf`
- Réponse : JSON avec le texte extrait et les métadonnées 