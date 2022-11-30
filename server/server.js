const express = require("express");
const mysql = require("mysql");
var cors = require("cors");
const e = require("express");

const config = require("./configuration.json");

const app = express();

const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));

// Route 1 - register as GET
app.get("/hello", async (req, res) => {
  res.send(`Hello! Welcome to the Entertainment Engine server!`);
});

app.get("/books", async (req, res) => {
  const { genre, author, minRating, numResults } = req.query;
  const existsFilter = genre || author || minRating;
  let query = `SELECT * FROM Books ${numResults ? `LIMIT ${numResults}` : ""}`;
  if (existsFilter) {
    const whereClauses = [];
    if (genre) {
      whereClauses.push(`g.GenreName IN ${genre}`);
    }
    if (author) {
      whereClauses.push(`author LIKE '%${author}%'`);
    }
    if (minRating) {
      whereClauses.push(`rating >= ${minRating}`);
    }
    const whereString = whereClauses.join(" AND ");
    query = `
    WITH BookGenres AS (
      SELECT BookISBN, GROUP_CONCAT(GenreName ORDER BY GenreName) AS GenreList
      FROM GenreOfBook
      GROUP BY BookISBN
    )
    SELECT * 
    FROM Books b
    JOIN BookGenres g ON b.ISBN = g.BookISBN
    ${whereString}  
    ${numResults ? `LIMIT ${numResults}` : ""}
    `;
  }
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results) {
      res.status(200).json({ books: results });
    }
  });
});

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
