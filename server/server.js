const express = require("express");
const server = express();
const port = 3000;

server.get("/", (req, res) => {
  res.json("Hello World!");
});

server.all(/^.*$/, (req, res) => {
  res.status(404).json("Not Found");
});

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
