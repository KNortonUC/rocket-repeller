const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 80;

const DATA_FILE = 'leaderboard.json';
let leaderboard = fs.existsSync(DATA_FILE)
  ? JSON.parse(fs.readFileSync(DATA_FILE))
  : [];

app.use(express.static(__dirname));
app.use(express.json());

app.post('/submit', (req, res) => {
	const { score } = req.body;
	if (typeof score !== 'number') return res.status(400).send('Invalid score');

	leaderboard.push({ score });
	leaderboard.sort((a, b) => b.score - a.score);
	leaderboard = leaderboard.slice(0, 5);
  
	fs.writeFileSync(DATA_FILE, JSON.stringify(leaderboard, null, 2));
	res.sendStatus(200);
});

app.get('/leaderboard', (req, res) => {
  res.json(leaderboard);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
