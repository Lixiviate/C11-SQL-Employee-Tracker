const express = require("express");
const { Pool } = require("pg");
const { database } = require("pg/lib/defaults");

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for the parsing of JSON data
app.use(express.json());
// Middleware for parsing of URL encoded data
// Does this need to be false?
app.use(express.urlencoded({ extended: false }));

// Access org_db
const pool = new Pool(
  {
    user: "********",
    password: "*********",
    host: "127.0.0.1",
    database: "********",
  },
  console.log("Access to org_db established.")
);

pool.connect();

pool.query("SELECT * FROM department", function (err, { rows }) {
  console.log(rows);
});

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
