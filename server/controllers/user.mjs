export const registerController = (req, res, next) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(400).json({
      error: "Input is not valid.",
    });
    // throw new Error(JSON.stringify({ error: "input is not valid" }));
    return;
  }

  const fileDataStr = readFile("./db.json", { encoding: "utf-8" });
  const fileData = JSON.parse(fileDataStr);

  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  fileData.user.push(userData);
  writeFile("./db.json", JSON.stringify(fileData), {
    encoding: "utf-8",
  });
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
