import { readFile, writeFile } from "node:fs/promises";
import jwt from "jsonwebtoken";

export const registerController = async (req, res, next) => {
  // Validate input
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400).json({
      error: "Input is not valid.",
    });
    // throw new Error(JSON.stringify({ error: "input is not valid" }));
    return;
  }

  // db file read
  const fileDataStr = await readFile("./db.json", { encoding: "utf-8" });

  // parse string to JSON object
  const fileData = JSON.parse(fileDataStr);

  // user data object
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  // Check if user already exists
  if (fileData.users.filter((e) => e.email === userData.email).length > 0) {
    res.status(400).json({
      error: "User already exists.",
    });
    return;
  }

  // Add user to db data
  if (!fileData.user) {
    fileData.user = [];
  }

  fileData.user.push(userData);

  // db json update
  await writeFile("./db.json", JSON.stringify(fileData), {
    encoding: "utf-8",
  });

  // Send response
  res.json({
    message: "Register Successful",
  });
  next();
};

export const loginController = async (req, res, next) => {
  // Validate input
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      error: "Input is not valid.",
    });
    return;
  }

  // read db file in string
  const fileDataStr = await readFile("./db.json", { encoding: "utf-8" });

  // parse string to JSON object
  const dbData = JSON.parse(fileDataStr);

  // Check if user exists
  const user = dbData.user.filter((e) => {
    return e.email === req.body.email;
  })[0];

  // match user password
  if (user.password !== req.body.password) {
    res.status(400).json({
      error: "wrong password.",
    });
    return;
  }

  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  res.json({
    token,
    name: user.name,
    email: user.email,
  });
  next();
};
