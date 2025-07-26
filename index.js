const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');

const app = express();
app.use(cors());
const upload = multer();

// Servir la page de test
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/test.html');
});

// Route unique : conversion PDF -> texte
app.post('/pdf2text', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier PDF fourni' });
    }

    // Convertir le fichier en buffer
    const buffer = req.file.buffer;
    
    // Parser le PDF en texte
    const data = await pdfParse(buffer);
    
    // Retourner le résultat
    res.json({
      text: data.text,
      pages: data.numpages,
      fileName: req.file.originalname,
      fileSize: req.file.size
    });

  } catch (error) {
    console.error('Erreur:', error);
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
}); 