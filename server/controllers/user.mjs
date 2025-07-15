import { readFile, writeFile } from "node:fs/promises";
import jwt from "jsonwebtoken";
import prisma, { Prisma } from "../db.mjs";

export const registerController = async (req, res, next) => {
  // Validate input
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400).json({
      error: "Input is not valid.",
    });
    // throw new Error(JSON.stringify({ error: "input is not valid" }));
    return;
  }

  await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
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

  // find user in DB
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!user) {
    res.status(404).json({
      error: "user not found.",
    });
    return;
  }

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
