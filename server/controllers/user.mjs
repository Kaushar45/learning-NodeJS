export const registerController = (req, res, next) => {
  res.json({
    message: "This is the register controller",
  });
  next();
};

export const loginController = (req, res, next) => {
  res.json({
    message: "This is the login controller",
  });
  next();
};
