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

/**
 * BOOK ROUTES
 */
app.get("/books", async (req, res) => {
  const { genres, author, minRating, numResults } = req.query;
  const existsFilter = genre || author || minRating;
  let query = `SELECT * FROM Books ${numResults ? `LIMIT ${numResults}` : ""}`;
  if (existsFilter) {
    const whereClauses = [];
    if (author) {
      whereClauses.push(`author LIKE '%${author}%'`);
    }
    if (minRating) {
      whereClauses.push(`rating >= ${minRating}`);
    }
    const whereString = whereClauses.join(" AND ");
    query = `
      WITH GenreSatisfyingBooks AS (
        SELECT BookISBN
        FROM GenreOfBook
        WHERE GenreName IN ${genres}
        GROUP BY BookISBN
        HAVING COUNT(*) = ${genres.length}
      )
      SELECT * 
      FROM Books b
      JOIN GenreSatisfyingBooks g ON b.ISBN = g.BookISBN
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

app.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT *
    FROM Books
    WHERE ISBN = ${id}
  `;
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results.length > 0) {
      res.status(200).json({ books: results[0] });
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  });
});

// TODO: /books/:id/similar

app.get("/authors", async (req, res) => {
  const { name, gender } = req.query;
  // TODO: is gender a string or an int here?  Do we need to parse it?
  const query = `
    SELECT *
    FROM Authors
    WHERE Name LIKE '%${name}%' AND gender = ${gender}
  `;
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results) {
      res.status(200).json({ authors: results });
    }
  });
});

app.get("/authors/:id", async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT *
    FROM Authors
    WHERE Name = ${id}
  `;
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results.length > 0) {
      res.status(200).json({ authors: results[0] });
    } else {
      res.status(404).json({ error: "Author not found" });
    }
  });
});

/**
 * MOVIE ROUTES
 */

/**
 * SHARED ROUTES
 */

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
