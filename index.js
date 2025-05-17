const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const FEEDBACK_FILE = 'feedback.json';
const LIKES_FILE = 'likes.json';

app.post('/feedback', (req, res) => {
  const newFeedback = req.body.message;
  if (!newFeedback) return res.status(400).send({ error: 'No message' });

  const current = fs.existsSync(FEEDBACK_FILE) ? JSON.parse(fs.readFileSync(FEEDBACK_FILE)) : [];
  current.push({ message: newFeedback, timestamp: new Date().toISOString() });

  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(current, null, 2));
  res.send({ success: true });
});

app.post('/like', (req, res) => {
  let count = 0;
  if (fs.existsSync(LIKES_FILE)) {
    count = JSON.parse(fs.readFileSync(LIKES_FILE)).count || 0;
  }
  count++;
  fs.writeFileSync(LIKES_FILE, JSON.stringify({ count }));
  res.send({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
