import jwt from "jsonwebtoken";
import prisma from "../db.mjs";
import bcrypt from "bcrypt";
import * as z from "zod";

// input model for user registration
const UserModel = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s]*$/, "Name cannot contain special characters"),
  email: z.email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const registerController = async (req, res, next) => {
  // Validate input
  try {
    await UserModel.parseAsync(req.body);
  } catch (e) {
    res.status(400);
    const msg = z.prettifyError(e);
    return res.json({ error: msg });
  }

  // hash password of user
  const newHashedPassword = await bcrypt.hash(req.body.password, 10);

  // add user in DB
  await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: newHashedPassword,
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
  const isOk = await bcrypt.compare(req.body.password, user.password);

  if (!isOk) {
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
