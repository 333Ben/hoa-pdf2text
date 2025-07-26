const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');

const app = express();
app.use(cors());
const upload = multer();

// Servir la page de test
app.get('/', (req, res) => {
  console.log('📄 Page d\'accueil demandée');
  res.sendFile(__dirname + '/test.html');
});

// Route unique : conversion PDF -> texte
app.post('/pdf2text', upload.single('pdf'), async (req, res) => {
  console.log('🔄 Requête de conversion reçue');
  
  try {
    if (!req.file) {
      console.log('❌ Aucun fichier fourni');
      return res.status(400).json({ error: 'Aucun fichier PDF fourni' });
    }

    console.log('📁 Fichier reçu:', {
      nom: req.file.originalname,
      taille: req.file.size,
      type: req.file.mimetype
    });

    // Convertir le fichier en buffer
    const buffer = req.file.buffer;
    console.log('📊 Buffer créé, taille:', buffer.length);
    
    // Parser le PDF en texte
    console.log('🔍 Début de l\'analyse PDF...');
    const data = await pdfParse(buffer);
    console.log('✅ PDF analysé avec succès');
    console.log('📝 Texte extrait (longueur):', data.text.length);
    console.log('📄 Nombre de pages:', data.numpages);
    console.log('🔤 Premiers caractères du texte:', data.text.substring(0, 100));
    
    // Retourner le résultat
    const result = {
      text: data.text,
      pages: data.numpages,
      fileName: req.file.originalname,
      fileSize: req.file.size
    };
    
    console.log('📤 Envoi de la réponse...');
    res.json(result);

  } catch (error) {
    console.error('💥 Erreur lors de la conversion:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la conversion',
      details: error.message
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/pdf2text`);
  console.log('🔍 Logs activés - vous verrez maintenant toutes les opérations');
}); 