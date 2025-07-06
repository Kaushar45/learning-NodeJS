const express = require("express");
const { writeFile } = require("node:fs/promises");
const server = express();
const port = 3000;

server.use(express.json());

server.use((req, res, next) => {
  req.test = "test";
  console.log("Global Middleware");
  next();
});

server.post(
  "/files",
  (req, res, next) => {
    console.log("local files Middleware");
    next();
  },
  async (req, res) => {
    console.log(res.query.name);
    console.log(req.body);
    console.log(req.test);

    await writeFile(`./${req.query.name}.txt`, req.body.content);
    res.json({ data: "files" });
  }
);

server.use((req, res, next) => {
  console.log(req.test);
  next();
});
server.get("/", (req, res) => {
  res.json("Hello root!");
});
server.get("/hello", (req, res) => {
  res.json("Hello World!");
});

server.post("/hello", (req, res) => {
  res.json("Hello World!");
});
server.all(/^.*$/, (req, res) => {
  res.json({
    message: "Wrong Route",
  });
  res.status(404).json("Not Found");
});

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
