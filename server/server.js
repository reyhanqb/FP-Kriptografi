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
  const { username, vote } = req.body;
  const sql = 'INSERT INTO userinfo (username, vote) VALUES (?, ?)';
  const values = [username, JSON.stringify(vote)];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Failed to insert user data' });
      return;
    }
    res.json({ message: 'User data inserted successfully' });
  });
});

app.post('/api/generatetoken', (req, res) => {
  const { vote, token } = req.body;
  const sql = 'INSERT INTO vote (vote, token) VALUES (?, ?)';
  const values = [vote, token];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Failed to insert user data' });
      return;
    }
    res.json({ message: 'Vote data inserted successfully' });
  });
});

app.get('/api/view', (req, res) => {
  const sql = 'SELECT vote, token FROM vote';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Failed to fetch vote data' });
      return;
    }

    const voteData = result.map(row => ({
      vote: row.vote,
      token: row.token
    }));

    res.json(voteData);
  });
});


// app.get('/api/viewvote', (req, res) => {
//   const { username, private_key } = req.query;
//   const sql = 'SELECT * FROM userinfo WHERE username = ? AND private_key = ?';

//   db.query(sql, [username, private_key], (err, results) => {
//     if (err) {
//       console.error('Error executing MySQL query:', err);
//       res.status(500).json({ error: 'Failed to fetch userinfo' });
//       return;
//     }

//     if (results.length === 0) {
//       res.json({ error: 'Invalid name or key. Please try again.' });
//     } else {
//       const voteData = {
//         username: results[0].username,
//         // private_key: results[0].private_key,
//         vote: JSON.parse(results[0].vote)
//       };
//       res.json(voteData);
//     }
//   });
// });

// app.get('/api/getVoteOptions', (req, res) => {
//   const hashedName = req.query.hashedName;
//   const sql = `SELECT * FROM userinfo WHERE vote LIKE '%${hashedName}%'`; // Modify the table and column names as per your database schema

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error executing MySQL query:', err);
//       res.status(500).json({ error: 'Failed to fetch vote optionAs' });
//       return;
//     }

//     if (results.length > 0) {
//       res.json(results[0].vote); // Assuming only one vote option matches the hashed name
//     } else {
//       res.json(null); // Hashed name does not match any of the vote options
//     }
//   });
// });


// // Insert new user data into userinfo table
// app.post('/api/userinfo', (req, res) => {
//   const { username, private_key, vote } = req.body;
//   const sql = 'INSERT INTO userinfo (username, private_key, vote) VALUES (?, ?, ?)';
//   const values = [username, private_key, vote];

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
