const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const DATA_FILE = 'macro-scores.json';

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins for local development
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Helper function to read data from file
const readData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading data file:', error);
    return [];
  }
};

// Helper function to write data to file
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data file:', error);
    throw error;
  }
};

// Get all scores
app.get('/api/scores', (req, res) => {
  try {
    const scores = readData();
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read scores' });
  }
});

// Save new score
app.post('/api/scores', (req, res) => {
  try {
    const scores = readData();
    const newScore = req.body;
    
    scores.unshift(newScore);
    
    // Keep only the last 50 scores
    const limitedScores = scores.slice(0, 50);
    
    writeData(limitedScores);
    res.json({ success: true, id: newScore.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// Delete score
app.delete('/api/scores/:id', (req, res) => {
  try {
    const scores = readData();
    const scoreId = req.params.id;
    
    const updatedScores = scores.filter(score => score.id !== scoreId);
    writeData(updatedScores);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete score' });
  }
});

app.listen(PORT, () => {
  console.log(`Local server running on http://localhost:${PORT}`);
  console.log(`Data will be stored in: ${path.resolve(DATA_FILE)}`);
});
