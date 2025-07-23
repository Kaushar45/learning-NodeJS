export const errorController = (err, req, res, next) => {
  if (err.isManual) {
    res.statusCode = err.statusCode;
    res.json({ error: err.message });
  } else {
    console.log(err);
    console.log(err.stack);
    res.statusCode = 500;
    res.json({
      error: "something is not ok",
    });
  }
};

export const undefinedRouteHandler = (req, res) => {
  res.json({
    message: "Wrong Route",
  });
  res.status(404).json("Not Found");
};

export class ServerError extends Error {
  constructor(statusCode, errorMessage) {
    super(errorMessage);
    this.statusCode = statusCode;
    this.isManual = true;
  }
}
