const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const DATA_DIR = path.join(__dirname, 'data');

app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static(__dirname));

// Lista arquivos salvos
app.get('/api/weeks', (req, res) => {
  fs.readdir(DATA_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: 'failed to read data dir' });
    const jsonFiles = files.filter(f => f.endsWith('.json')).sort().reverse();
    res.json(jsonFiles);
  });
});

// Retorna um arquivo salvo
app.get('/api/weeks/:file', (req, res) => {
  const file = path.basename(req.params.file);
  const full = path.join(DATA_DIR, file);
  fs.access(full, fs.constants.R_OK, (err) => {
    if (err) return res.status(404).json({ error: 'not found' });
    res.sendFile(full);
  });
});

// Salva novo arquivo
app.post('/api/weeks', (req, res) => {
  const payload = req.body;
  if (!payload || !payload.week) return res.status(400).json({ error: 'invalid payload' });
  const now = new Date();
  const name = `week-${now.toISOString().replace(/[:.]/g,'-')}.json`;
  const full = path.join(DATA_DIR, name);
  fs.writeFile(full, JSON.stringify(payload, null, 2), (err) => {
    if (err) return res.status(500).json({ error: 'failed to write' });
    res.json({ ok: true, filename: name });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server listening on http://localhost:' + port));
