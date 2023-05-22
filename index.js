const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const {getNewUsers} = require('./searcher')
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape1", (req, res) => {

  scrapeLogic(res);
});

app.get("/scrape2", (req, res) => {

  getNewUsers(res)
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
