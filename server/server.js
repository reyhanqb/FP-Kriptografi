const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();

app.listen(3000, () => {
  console.log("Server started ...");
});

app.use(cors());
app.use(express.json()); // Enable JSON parsing for POST requests

// MySQL connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'duljek',
  password: '291201',
  database: 'fp_kriptografi',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

app.post('/api/vote', (req, res) => {
  const { username, vote_key, vote } = req.body;
  const sql = 'INSERT INTO userinfo (username, vote_key, vote) VALUES (?, ?, ?)';
  const values = [username, vote_key, JSON.stringify(vote)];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Failed to insert user data' });
      return;
    }
    res.json({ message: 'User data inserted successfully' });
  });
});

app.get('/api/viewvote', (req, res) => {
  const { username, vote_key } = req.query;
  const sql = 'SELECT * FROM userinfo WHERE username = ? AND vote_key = ?';

  db.query(sql, [username, vote_key], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Failed to fetch userinfo' });
      return;
    }

    if (results.length === 0) {
      res.json({ error: 'Invalid name or key. Please try again.' });
    } else {
      const voteData = {
        username: results[0].username,
        vote_key: results[0].vote_key,
        vote: JSON.parse(results[0].vote)
      };
      res.json(voteData);
    }
  });
});

// // Insert new user data into userinfo table
// app.post('/api/userinfo', (req, res) => {
//   const { username, vote_key, vote } = req.body;
//   const sql = 'INSERT INTO userinfo (username, vote_key, vote) VALUES (?, ?, ?)';
//   const values = [username, vote_key, vote];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Error executing MySQL query:', err);
//       res.status(500).json({ error: 'Failed to insert user data' });
//       return;
//     }
//     res.json({ message: 'User data inserted successfully' });
//   });
// });

// // Serve the Vue.js frontend
// const staticPath = path.join(__dirname, 'dist');
// app.use(express.static(staticPath));

// // Catch-all route to serve the Vue.js app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(staticPath, '../client/views/Connect.vue'));
// });

// // Start the server
// const port = 3000; // or any other port you prefer
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
