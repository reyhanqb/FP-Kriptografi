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
app.use(bodyParser());

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

// Get userinfo table data
app.get('/api/userinfo', (req, res) => {
  const sql = 'SELECT * FROM userinfo';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Failed to fetch userinfo' });
      return;
    }
    res.json(results);
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
