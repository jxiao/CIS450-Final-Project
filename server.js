const express = require("express");
const mysql = require("mysql");
var cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, "./client/build")));

const connection = mysql.createConnection({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB,
});
connection.connect();

app.use(cors({ credentials: true, origin: ["http://localhost:3000", "*"] }));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

/**
 * BOOK ROUTES
 */
app.get("/books", async (req, res) => {
  const { genres, author, minRating, numResults } = req.query;
  let query = `SELECT * FROM Books ${numResults ? `LIMIT ${numResults}` : ""}`;
  if (genres || author || minRating) {
    const whereClauses = [];
    if (author) {
      whereClauses.push(`author LIKE '%${author}%'`);
    }
    if (minRating) {
      whereClauses.push(`rating >= ${minRating}`);
    }
    let genresFormatted = genres;
    if (genres && genres.length > 0) {
      genres = `(${genres.map((g) => `'${g}'`).join(",")})`;
    }
    const whereString = whereClauses.join(" AND ");
    query = `
      WITH GenreSatisfyingBooks AS (
        SELECT BookISBN
        FROM GenreOfBook
        ${
          genres && genres.length > 0
            ? `WHERE GenreName IN ${genresFormatted}`
            : ""
        }
        GROUP BY BookISBN
        ${
          genres && genres.length > 0
            ? `HAVING COUNT(*) = ${genres.length}`
            : ""
        }
      )
      SELECT * 
      FROM Books b
      JOIN GenreSatisfyingBooks g ON b.ISBN = g.BookISBN
      ${whereString ? `WHERE ${whereString}` : ""}
      ORDER BY RAND() 
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

app.get("/book/:id", async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT ISBN, NumPages, GoodreadsLink, Title, ImageURL, Description, Rating, GROUP_CONCAT(DISTINCT GenreName) AS genre, GROUP_CONCAT(DISTINCT AuthorName) AS authors
    FROM Books
    JOIN Writes ON Books.ISBN = Writes.BookISBN
    JOIN GenreOfBook ON Books.ISBN = GenreOfBook.BookISBN
    WHERE ISBN = '${id}'
  `;
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  });
});

app.get("/book/:id/similar", async (req, res) => {
  const { id } = req.params;
  const { numResults } = req.query;
  const genreQuery = `
    SELECT GenreName
    FROM GenreOfBook
    WHERE BookISBN = '${id}'
  `;
  connection.query(genreQuery, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else {
      const genres = `(${results
        .map((result) => `'${result.GenreName}'`)
        .join(",")})`;
      const authorQuery = `
        SELECT AuthorName
        FROM Writes
        WHERE BookISBN = '${id}'
      `;
      connection.query(authorQuery, (error, results) => {
        if (error) {
          res.status(400).json({ error: error });
        } else {
          const authors = `(${results
            .map((result) => `'${result.Name}'`)
            .join(",")})`;
          const query = `
          WITH GenreSatisfyingBooks AS (
            SELECT BookISBN, COUNT(*) AS numSimilar
            FROM GenreOfBook
            WHERE GenreName IN ${genres === "()" ? "('')" : genres}
            GROUP BY BookISBN
            ORDER BY numSimilar DESC
          ),
          AuthorSatisfyingBooks AS (
            SELECT BookISBN, COUNT(*) AS numSimilar
            FROM Writes
            WHERE AuthorName IN ${authors}
            GROUP BY BookISBN
            ORDER BY numSimilar DESC
          ),
          Unioned AS (
            SELECT * FROM GenreSatisfyingBooks
            UNION
            SELECT * FROM AuthorSatisfyingBooks
          )
          SELECT Books.ISBN as ISBN, Books.Title as Title, Books.ImageURL as ImageURL, "Book" as Type, SUM(numSimilar) AS numSimilar
          FROM Unioned U
          JOIN Books ON Books.ISBN = U.BookISBN
          GROUP BY Books.ISBN, Books.Title, Type
          HAVING Books.ISBN != '${id}'
          ORDER BY numSimilar DESC
          LIMIT ${numResults || 10};
        `;
          connection.query(query, (error, results) => {
            if (error) {
              res.status(400).json({ error: error });
            } else {
              res.status(200).json({ books: results });
            }
          });
        }
      });
    }
  });
});

app.get("/authors", async (req, res) => {
  const { name, gender } = req.query;
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
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: "Author not found" });
    }
  });
});

/**
 * MOVIE ROUTES
 */

app.get("/movies", async (req, res) => {
  const { genres, director, minRating, numResults } = req.query;
  let query = `SELECT * FROM Movies ${numResults ? `LIMIT ${numResults}` : ""}`;
  if (genres || director || minRating) {
    const whereClauses = [];
    if (director) {
      whereClauses.push(`director LIKE '%${director}%'`);
    }
    if (minRating) {
      whereClauses.push(`rating >= ${minRating}`);
    }
    let genresFormatted = genres;
    if (genres) {
      genres = `(${genres.map((g) => `'${g}'`).join(",")})`;
    }
    const whereString = whereClauses.join(" AND ");
    query = `
    WITH GenreSatisfyingMovies AS (
      SELECT MovieID
      FROM GenreOfMovie
      ${
        genres && genres.length > 0
          ? `WHERE GenreName IN ${genresFormatted}`
          : ""
      }
      GROUP BY MovieID
      ${genres && genres.length > 0 ? `HAVING COUNT(*) = ${genres.length}` : ""}
    )
    SELECT *
    FROM Movies m
    JOIN GenreSatisfyingMovies g ON m.ID = g.MovieID
    ${whereString ? `WHERE ${whereString}` : ""}
    ORDER BY RAND()
    ${numResults ? `LIMIT ${numResults}` : ""}
  `;
  }
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results) {
      res.status(200).json({ movies: results });
    }
  });
});

app.get("/movie/:id", async (req, res) => {
  const { id } = req.params;
  const query = `
  SELECT Movies.Movie_id as movieId, Movies.Title, Movies.Overview, AVG(Rating) as Rating, GROUP_CONCAT(DISTINCT GenreName) as genre, GROUP_CONCAT(DISTINCT Directors.Name) as directors, GROUP_CONCAT(DISTINCT Actors.Name) as actors
  FROM Movies
  LEFT JOIN Directs ON Movies.Movie_id = Directs.Movie_id
  LEFT JOIN Directors ON Directors.Id = Directs.DirectorId
  LEFT JOIN Plays ON Movies.Movie_id = Plays.Movie_id
  LEFT JOIN Actors ON Actors.Id = Plays.ActorId
  LEFT JOIN GenreOfMovie ON Movies.Movie_id = GenreOfMovie.Movie_id
  LEFT JOIN Ratings ON Ratings.MovieId = Movies.Movie_id
  WHERE Movies.Movie_id = ${id};
  `;
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  });
});

app.get("/movie/:id/similar", async (req, res) => {
  const { id } = req.params;
  const { numResults } = req.query;

  const directorsQuery = `
    SELECT DirectorId
    FROM Directs
    WHERE Movie_id = ${id}
  `;
  connection.query(directorsQuery, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else {
      const directors = results
        ? `(${results.map((result) => `'${result.DirectorId}'`).join(",")})`
        : "";
      const actorsQuery = `
        SELECT ActorId
        FROM Plays
        WHERE Movie_id = ${id}
      `;
      connection.query(actorsQuery, (error, results) => {
        if (error) {
          res.status(400).json({ error: error });
        } else {
          const actors = results
            ? `(${results.map((result) => `'${result.ActorId}'`).join(",")})`
            : "";
          const query = `
            WITH Director_movies AS (
              SELECT Movie_id, COUNT(*) AS numSimilar
              FROM Directs
              WHERE DirectorId IN ${directors}
              GROUP BY Movie_id
              ORDER BY numSimilar DESC
            ),
            Actor_movies AS (
              SELECT Movie_id, COUNT(*) AS numSimilar
              FROM Plays
              WHERE ActorId IN ${actors === "()" ? "('')" : actors}
              GROUP BY Movie_id
              ORDER BY numSimilar DESC
            ),
            Unioned AS (
              SELECT * FROM Director_movies
              UNION
              SELECT * FROM Actor_movies
            )
            SELECT Movies.Movie_id as movieId, Movies.Title as Title, "Movie" as Type, SUM(numSimilar) AS numSimilar
            FROM Unioned U
            JOIN Movies ON Movies.Movie_id = U.Movie_id
            GROUP BY U.Movie_id, Movies.Title, Type
            HAVING U.Movie_id != ${id}
            ORDER BY numSimilar DESC
            LIMIT ${numResults || 10};
          `;
          connection.query(query, (error, results) => {
            if (error) {
              res.status(400).json({ error: error });
            } else {
              res.status(200).json({ movies: results });
            }
          });
        }
      });
    }
  });
});

app.get("/actors", async (req, res) => {
  const { name, gender, numResults } = req.query;
  let query = `
    SELECT *
    FROM Actors
    ${numResults ? `LIMIT ${numResults}` : ""}
  `;
  if (name || gender) {
    const whereClauses = [];
    if (name) {
      whereClauses.push(`Name LIKE '%${name}%'`);
    }
    if (gender) {
      whereClauses.push(`gender = ${gender}`);
    }
    const whereString = whereClauses.join(" AND ");
    query = `
      SELECT *
      FROM Actors
      WHERE ${whereString}
      ${numResults ? `LIMIT ${numResults}` : ""}
    `;
  }
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results) {
      res.status(200).json({ actors: results });
    }
  });
});

app.get("/actor/:id", async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT *
    FROM Actors
    WHERE Id = ${id}
  `;
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: "Actor not found" });
    }
  });
});

app.get("/directors", async (req, res) => {
  const { name, gender, numResults } = req.query;
  let query = `
    SELECT *
    FROM Directors
    ${numResults ? `LIMIT ${numResults}` : ""}
  `;
  if (name || gender) {
    const whereClauses = [];
    if (name) {
      whereClauses.push(`Name LIKE '%${name}%'`);
    }
    if (gender) {
      whereClauses.push(`gender = ${gender}`);
    }
    const whereString = whereClauses.join(" AND ");
    query = `
      SELECT *
      FROM Directors
      WHERE ${whereString}
      ${numResults ? `LIMIT ${numResults}` : ""}
    `;
  }
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results) {
      res.status(200).json({ directors: results });
    }
  });
});

app.get("/directors/best", async (req, res) => {
  const { numRaters, numMovies } = req.query;
  const query = "SELECT * FROM directors_best_materialized_view;";
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results) {
      res.status(200).json({ directors: results });
    }
  });
});

/**
 * CREATING MATERIALIZED VIEW FOR /directors/best
 * 
  CREATE TABLE directors_best_materialized_view AS
  WITH MovieRatings AS (
    SELECT MovieId, AVG(rating) as AverageRating
    FROM Ratings
    GROUP BY MovieId
  ),
  DirectorStats AS (
    SELECT D.DirectorId, AVG(AverageRating) AS DirectorAvgRating
    FROM Directs D
    JOIN MovieRatings M ON D.Movie_id = M.MovieId
    GROUP BY DirectorId
  ),
  HighestDirectors AS (
    SELECT DirectorId
    FROM DirectorStats
    WHERE DirectorAvgRating >= ALL (SELECT DirectorAvgRating FROM DirectorStats)
  ),
  DirectorBestRating AS (
    SELECT H.DirectorId AS DirectorId, MAX(AverageRating) as max_rating
    FROM HighestDirectors H
    JOIN Directs D ON H.DirectorId = D.DirectorId
    JOIN MovieRatings M ON D.movie_id = M.MovieId
    GROUP BY DirectorId
  ),
  BestMovies AS (
    SELECT D.DirectorId, Movie_id
    FROM DirectorBestRating
    JOIN Directs D ON DirectorBestRating.DirectorId = D.DirectorId
    JOIN MovieRatings M ON D.movie_id = M.MovieId
    WHERE M.AverageRating = DirectorBestRating.max_rating
  ),
    OneBestMoviePerDirector AS (
    SELECT DirectorId, Movie_id
    FROM (SELECT * FROM BestMovies B ORDER BY RAND()) A
    GROUP BY DirectorId
  )
  (SELECT DS.name, M.title, M.movie_id
  FROM OneBestMoviePerDirector O
  JOIN Directors DS ON DS.Id = O.DirectorId
  JOIN (SELECT Movie_id, Title FROM Movies) M ON M.movie_id = O.movie_id);
 * 
 */

app.get("/director/:id", async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT *
    FROM Directors
    WHERE Id = ${id}
  `;
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: "Director not found" });
    }
  });
});

/**
 * SHARED ROUTES
 */

app.get("/genres", async (req, res) => {
  const { books, movies } = req.query;
  const bookGenresQuery = `
    SELECT genreName
    FROM GenreOfBook
    GROUP BY genre
  `;
  const movieGenresQuery = `
    SELECT genreName
    FROM GenreOfMovie
    GROUP BY genre
  `;
  let bookResults = [];
  let movieResults = [];
  let errorFree = true;
  if (books) {
    connection.query(bookGenresQuery, (error, results) => {
      if (error) {
        res.status(400).json({ error: error });
      } else if (results) {
        bookResults = results;
      }
      errorFree &= error;
    });
  }
  if (movies) {
    connection.query(movieGenresQuery, (error, results) => {
      if (errorFree && error) {
        res.status(400).json({ error: error });
      } else if (results) {
        movieResults = results;
      }
      errorFree &= error;
    });
  }
  if (errorFree) {
    const result = {};
    if (books) {
      result.books = bookResults;
    }
    if (movies) {
      result.movies = movieResults;
    }
    res.status(200).json(result);
  }
});

app.get("/search", async (req, res) => {
  const { search } = req.query;
  const query = `
    WITH Matched_books AS (
      SELECT ISBN, Title, 'Book' AS Type, rating
      FROM Books
      WHERE Title LIKE '%${search}%'
    ),
    Movie_ratings AS (
      SELECT MovieId, AVG(rating) as AverageRating
      FROM Ratings
      GROUP BY MovieId
    ),
    Matched_movies AS (
      SELECT Title, Movie_id AS ID, 'Movie' AS Type, AverageRating
      FROM (SELECT Title, Movie_id FROM Movies) M
      JOIN Movie_ratings R ON R.MovieId = M.Movie_id
      WHERE Title LIKE '%${search}%'
    ),
    Matched_authors AS (
      SELECT BookISBN AS ISBN, B.Title AS Title, 'Book' AS Type, B.rating
      FROM Writes W
      JOIN (SELECT ISBN, Title, rating FROM Books) B ON W.BookISBN = B.ISBN
      WHERE W.AuthorName LIKE '%${search}%'
    ),
    Matched_directors AS (
      SELECT M.Title, M.Movie_id AS ID, 'Movie' AS Type, R.AverageRating
      FROM Directs D
      JOIN (SELECT Id, Name FROM Directors) S ON D.DirectorId = S.Id
      JOIN (SELECT Title, Movie_id FROM Movies) M ON D.Movie_id = M.Movie_id
      JOIN Movie_ratings R ON R.MovieId = D.Movie_id
      WHERE S.Name LIKE '%${search}%'
    ),
    Matched_actors AS (
      SELECT M.Title, M.Movie_id AS ID, 'Movie' AS Type, AverageRating
      FROM (SELECT ActorId, Movie_id FROM Plays) P
      JOIN (SELECT Id, Name FROM Actors) A on P.ActorId = A.Id
      JOIN (SELECT Movie_id, Title FROM Movies) M ON P.Movie_id = M.Movie_id
      JOIN Movie_ratings R ON R.MovieId = P.Movie_id
      WHERE A.Name LIKE '%${search}%'
    ),
    BooksUnioned AS (
      (SELECT B.ISBN as Id, B.Title, B.Type, B.Rating FROM Matched_books B)
      UNION
      (SELECT B.ISBN as Id, B.Title, B.Type, B.Rating FROM Matched_authors B)
    ),
    Final_books AS (
      SELECT B.Id as Id, B.Title, B.Type, B.Rating, GROUP_CONCAT(GenreName ORDER BY GenreName SEPARATOR ', ') AS GenreList
      FROM BooksUnioned B
      JOIN GenreOfBook G ON G.BookISBN = B.Id
      GROUP BY B.Id, B.Title, B.Type, B.Rating
    ),
    UnionedMovies AS (
        (SELECT * FROM Matched_movies)
        UNION
        (SELECT * FROM Matched_directors)
        UNION
        (SELECT * FROM Matched_actors)
    ),
    Final_movies AS (
      SELECT M.ID as Id, M.Title, M.Type, M.AverageRating AS Rating, GROUP_CONCAT(GenreName ORDER BY GenreName SEPARATOR ', ') as GenreList
      FROM UnionedMovies M
      JOIN GenreOfMovie G ON M.ID = G.Movie_id
      GROUP BY M.ID, M.Title, M.Type, M.AverageRating
    )
    (SELECT Id, Title, Type, Rating, GenreList
    FROM Final_books)
    UNION
    (SELECT Id, Title, Type, Rating, GenreList
    FROM Final_movies);
  `;
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results) {
      res.status(200).json({ results: results });
    }
  });
});

app.get("/bookrecommendation", async (req, res) => {
  const { genres, minRating: minRatingString } = req.query;
  const minRating = parseInt(minRatingString);
  const query = `
    WITH books_genres AS (
      SELECT BookISBN, COUNT(*) AS GenresMatched
      FROM GenreOfBook
      WHERE GenreName IN ${genres}
      GROUP BY BookISBN
      ORDER BY GenresMatched DESC
    )
      SELECT Title, ISBN AS Id, 'book' as Type
      FROM Books A
      JOIN (SELECT BookISBN FROM books_genres) B ON A.ISBN = B.BookISBN
      WHERE Rating >= ${minRating}
      LIMIT 10
  `;
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results) {
      res.status(200).json({ results: results });
    }
  });
});

app.get("/movierecommendation", async (req, res) => {
  const {
    genres,
    minRating: minRatingString,
    minNumRaters: minNumRatersString,
  } = req.query;
  const { minRating, minNumRaters } = {
    minRating: parseInt(minRatingString),
    minNumRaters: parseInt(minNumRatersString),
  };
  const query = `
    SELECT Title, A.Movie_id AS Id, 'movie' as Type
    FROM Movies A
    ${minNumRaters === 0 ? "LEFT" : ""} JOIN (SELECT MovieId
        FROM Ratings
        GROUP BY MovieId
        HAVING AVG(rating) >= ${minRating} ${
    minNumRaters > 1 ? `AND COUNT(DISTINCT UserId) >= ${minNumRaters}` : ""
  }) R ON A.Movie_id = R.MovieId
    JOIN (
      SELECT Movie_id, COUNT(*) AS GenresMatched
      FROM GenreOfMovie
      WHERE GenreName IN ${genres}
      GROUP BY Movie_id
      ORDER BY GenresMatched DESC
      ) G ON A.Movie_id = G.Movie_id
    LIMIT 10
  `;
  console.log(typeof minNumRaters, typeof minRating);
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results) {
      res.status(200).json({ results: results });
    }
  });
});

app.get("/allrecommendations", async (req, res) => {
  const {
    genres,
    minRating: minRatingString,
    minNumRaters: minNumRatersString,
  } = req.query;
  const { minRating, minNumRaters } = {
    minRating: parseInt(minRatingString),
    minNumRaters: parseInt(minNumRatersString),
  };
  const query = `
    WITH Five_books AS (
      SELECT Title, ISBN AS Id, 'book' as Type
      FROM Books A
      JOIN (SELECT BookISBN
            FROM (SELECT BookISBN, COUNT(*) AS GenresMatched
            FROM GenreOfBook
            WHERE GenreName IN ${genres}
            GROUP BY BookISBN
            ORDER BY GenresMatched DESC) C) B ON A.ISBN = B.BookISBN
      WHERE Rating >= ${minRating}
      LIMIT 5
    ),
    Five_movies AS (
      SELECT Title, A.Movie_id AS Id, 'movie' as Type
      FROM Movies A
      ${minNumRaters === 0 ? "LEFT" : ""} JOIN (SELECT MovieId
            FROM (
                SELECT MovieId
                FROM Ratings
                GROUP BY MovieId
                HAVING AVG(rating) >= ${minRating} ${
    minNumRaters > 1 ? `AND COUNT(DISTINCT UserId) >= ${minNumRaters}` : ""
  }
                ) B
            ) R ON A.Movie_id = R.MovieId
      JOIN (SELECT Movie_id, COUNT(*) AS GenresMatched
            FROM GenreOfMovie
            WHERE GenreName IN ${genres}
            GROUP BY Movie_id
            ORDER BY GenresMatched DESC
          ) G ON A.Movie_id = G.Movie_id
      LIMIT 5
    )
    (SELECT Title, Id, Type
    FROM Five_books)
    UNION
    (SELECT Title, Id, Type
    FROM Five_movies);
  `;
  console.log(minNumRaters, typeof minNumRaters, query);
  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).json({ error: error });
    } else if (results) {
      res.status(200).json({ results: results });
    }
  });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const PORT = process.env.PORT || 8080;
// const HOST = process.env.SERVER_HOST || "127.0.0.1";
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
