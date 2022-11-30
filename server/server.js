const express = require("express");
const mysql = require("mysql");
var cors = require("cors");
const e = require("express");

const config = require("./config.json");

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

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
