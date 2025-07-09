import express from "express";
import { globalMiddleware, authMiddleware } from "./middleware";
import { errorController, undefinedRouteHandler } from "./error.mjs";
import { registerController, loginController } from "./controllers/user.mjs";
import { prizeController } from "./controllers/prize.mjs";
const server = express();
const port = 3000;

//body parser middleware
server.use(express.json());

server.use(globalMiddleware);

server.post("/register", registerController);
server.get("/login", loginController);
server.get("/prize", authMiddleware, prizeController);

// catch all other routes
server.all(/^.*$/, undefinedRouteHandler);

server.use(errorController);

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
