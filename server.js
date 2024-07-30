const express = require("express");
const path = require("path");

const { Pool } = require("pg");
const PORT = process.env.PORT || 3001;

// Middleware for the parsing of JSON data
app.use(express.json());
// Middleware for parsing of URL encoded data
// Does this need to be false?
app.use(express.urlencoded({ extended: false }));
