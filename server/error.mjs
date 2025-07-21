export const errorController = (err, req, res, next) => {
  console.log(err);
  res.status(404);
  res.json({
    message: "something is not ok",
    error: err.message,
  });
};

export const undefinedRouteHandler = (req, res) => {
  res.json({
    message: "Wrong Route",
  });
  res.status(404).json("Not Found");
};
