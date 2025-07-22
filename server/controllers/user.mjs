import jwt from "jsonwebtoken";
import prisma from "../db.mjs";
import bcrypt from "bcrypt";
import * as z from "zod";
import { sendEmail } from "../email.mjs";
import randomstring from "randomstring";
import dayjs from "dayjs";

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

  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: newHashedPassword,
    },
  });
  console.log(user);
  // Send response
  res.json({
    message: "Register Successful",
  });
};

// input model for user login
const UserLoginModel = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 8 characters long" }),
});

export const loginController = async (req, res, next) => {
  const result = await UserLoginModel.safeParseAsync(req.body);

  if (!result.success) {
    res.status(400);
    const msg = z.prettifyError(result.error);
    return res.json({ error: msg });
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
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
  res.json({
    token,
    name: user.name,
    email: user.email,
  });
};

export const forgotPasswordController = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!user) {
    res.statusCode = 404;
    return res.json({ error: "User Does Not Exist" });
  }

  const token = randomstring.generate();
  await prisma.user.update({
    where: { email: req.body.email },
    data: { resetToken: token, resetTokenExpiry: new Date(Date.now()) },
  });
  const msg = `<html><body>Click this link <a href="http://localhost:3000/reset_password/${token}">Click Here</a></body></html>`;

  await sendEmail(req.body.email, "Forgot Password", msg);

  res.json({
    message: "Email sent successfully, check your email",
  });
};

export const resetPasswordController = async (req, res, next) => {
  const users = await prisma.user.findMany({
    where: {
      resetToken: req.params.token,
    },
  });

  if (!users) {
    res.statusCode = 404;
    return res.json({ message: "invalid reset link" });
  }

  const user = users[0];
  const subTime = dayjs().subtract(
    process.env.RESET_LINK_EXPIRY_TIME_IN_MINUTES,
    "minute"
  );

  if (dayjs(subTime).isAfter(dayjs(user.resetTokenExpiry))) {
    res.statusCode = 400;
    return res.json({
      message: "Link has been Expired! Try Again",
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },

    data: {
      resetToken: null,
      password: hashedPassword,
    },
  });
  res.json({ message: "password reset successful" });
};
