export const registerController = (req, res, next) => {
  // Validate input
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(400).json({
      error: "Input is not valid.",
    });
    // throw new Error(JSON.stringify({ error: "input is not valid" }));
    return;
  }

  // db file read
  const fileDataStr = readFile("./db.json", { encoding: "utf-8" });

  // parse string to JSON object
  const fileData = JSON.parse(fileDataStr);

  // user data object
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  // Check if user already exists
  if (fileData.user.some((user) => user.email === userData.email)) {
    res.status(400).json({
      error: "User already exists.",
    });
    return;
  }

  fileData.user.push(userData);

  // db json update
  writeFile("./db.json", JSON.stringify(fileData), {
    encoding: "utf-8",
  });
  // Send response
  res.json({
    message: "Register Successful",
  });
  next();
};

export const loginController = (req, res, next) => {
  res.json({
    message: "This is the login controller",
  });
  next();
};
