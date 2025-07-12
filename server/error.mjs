export const errorController = (err, req, res, next) => {
  console.log(err);
  res.json({
    message: "Internal Server Error",
    error: err.message,
  });
  next();
};

export const undefinedRouteHandler = (req, res) => {
  res.json({
    message: "Wrong Route",
  });
  res.status(404).json("Not Found");
};
