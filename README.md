# HOA PDF to Text Converter

Un outil hybride pour convertir des fichiers PDF en texte brut, avec support pour les PDF scannés via AWS Textract.

## Fonctionnalités

- **PDF textuels** : Extraction rapide avec pdf-parse
- **PDF scannés** : Fallback automatique vers AWS Textract pour l'OCR
- **Détection intelligente** : Détection automatique des PDF probablement scannés
- **Double fallback** : Si pdf-parse échoue, Textract prend le relais

## Installation

```bash
npm install
```

## Configuration AWS (Optionnelle)

Pour activer le support des PDF scannés avec AWS Textract :

### 1. Créer le fichier `.env`
Créez un fichier `.env` à la racine du projet :
```env
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=eu-west-1
```

### 2. Configuration AWS
1. **Compte AWS** : Créez un compte sur https://aws.amazon.com/fr/
2. **Console AWS** : Allez dans IAM > Users
3. **Créer un utilisateur** : Nom: `textract-user` 
4. **Permissions** : Attachez la politique `AmazonTextractFullAccess`
5. **Clés d'accès** : Générez des clés programmatiques et copiez-les dans `.env`

### 3. Régions disponibles
Textract est disponible dans plusieurs régions :
- `eu-west-1` (Irlande) - **Recommandé pour l'Europe**
- `us-east-1` (Virginie du Nord)
- `us-west-2` (Oregon)

**Note**: Sans configuration AWS, l'outil fonctionne avec pdf-parse uniquement (PDF textuels).

## Démarrage

```bash
npm start
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

### Réponse API

```json
{
  "text": "Texte extrait du PDF",
  "pages": 5,
  "fileName": "document.pdf",
  "fileSize": 1024000,
  "extractionMethod": "pdf-parse", // ou "textract"
  "blocks": 150, // Nombre de blocs Textract (si utilisé)
  "fallbackReason": "PDF probablement scanné" // Si Textract utilisé
}
```

## Logique de traitement

1. **pdf-parse en premier** : Tentative d'extraction classique
2. **Détection de scan** : Si < 50 caractères/page → PDF probablement scanné
3. **Textract automatique** : Bascule vers OCR si PDF scanné détecté
4. **Fallback complet** : Si pdf-parse échoue complètement, Textract prend le relais

## Coûts AWS

Textract facture par page analysée (~$1.50 pour 1000 pages). L'outil minimise les coûts en n'utilisant Textract que quand nécessaire.

## Dépannage

### Textract ne s'active pas ?
1. Vérifiez que le fichier se nomme **`.env`** (pas `.env.local`)
2. Redémarrez le serveur après avoir créé/modifié `.env`
3. Vérifiez les logs : doit afficher "PDF scanné détecté, basculement vers Textract..."

### Variables d'environnement
Testez si vos variables sont chargées :
```bash
node -e "require('dotenv').config(); console.log('AWS:', process.env.AWS_ACCESS_KEY_ID ? 'OK' : 'MANQUANT');"
``` 