import { NextFunction, Response } from "express";
import { getUserById, User } from "../module/user";
import { Request } from "./../request";
import jwt from "jsonwebtoken";

export const validateAuthIdToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.headers.authorization ||
    req.signedCookies.auth ||
    req.signedCookies.admin_auth;

  if (!token) {
    res
      .clearCookie("auth", {
        signed: true,
      })
      .status(403)
      .json({ message: "Unauthorized request." });
    return;
  }
  const userId = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
  if (!userId) {
    res
      .clearCookie("auth", {
        signed: true,
      })
      .status(403)
      .json({ message: "Unauthorized request." });
    return;
  }

  const user: User = await getUserById(userId as string);
  if (!user) {
    res
      .clearCookie("auth", {
        signed: true,
      })
      .status(403)
      .json({ message: "Unauthorized request." });
    return;
  }

  const userRawData = user.toJSON();
  delete userRawData.password;

  req.authUser = userRawData;

  next();
  return;
};
