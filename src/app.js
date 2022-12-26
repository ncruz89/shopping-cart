const path = require("path");
const express = require("express");
require("./db/mongoose");
const itemRouter = require("./routers/item");

// express setup - boilerplate
const app = express();

const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(itemRouter);

module.exports = app;
