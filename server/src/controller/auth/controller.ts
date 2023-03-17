import { Response } from "express";
import { Request } from "./../../request";
import Joi, { isError } from "joi";
import { get as _get } from "lodash";
import jwt from "jsonwebtoken";
import { getUserByEmail, IUser, saveUser, User } from "../../module/user";

export default class Controller {
  private readonly registerSchema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .external(async (v: string) => {
        const user: IUser = await getUserByEmail(v);
        if (user) {
          throw new Error("Email already exists");
        }
        return v;
      }),
    password: Joi.string()
      .required()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
      .custom((v) => {
        return jwt.sign(v, process.env.JWT_SECRET_PASSWORD);
      }),
  });

  private readonly loginSchema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .external(async (v: string) => {
        const user: IUser = await getUserByEmail(v);
        if (!user) {
          throw new Error("Please Register first");
        }
        return user;
      }),
    password: Joi.string()
      .required()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/),
  });

  protected readonly register = async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      console.log("payload", payload);
      const payloadValue = await this.registerSchema
        .validateAsync(payload)
        .then((value) => {
          return value;
        })
        .catch((e) => {
          console.log(e);
          if (isError(e)) {
            res.status(422).json(e);
          } else {
            res.status(422).json({ message: e.message });
          }
        });
      if (!payloadValue) {
        return;
      }

      const user = await saveUser(
        new User({
          ...payloadValue,
        })
      );
      const token = jwt.sign(user.id.toString(), process.env.JWT_SECRET_TOKEN);
      delete user.password;
      res
        .cookie("auth", token, {
          expires: new Date("12/31/2100"),
          signed: true,
        })
        .status(200)
        .setHeader("x-auth-token", token)
        .status(200)
        .json({ message: "Register successfully", user });
    } catch (error) {
      console.error("error", "error in register", error);
      res.status(500).json({
        message: error.message,
      });
    }
  };

  protected readonly login = async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      console.log("payload", payload);
      const payloadValue = await this.loginSchema
        .validateAsync(payload)
        .then((value) => {
          return value;
        })
        .catch((e) => {
          console.log(e);
          if (isError(e)) {
            res.status(422).json(e);
          } else {
            res.status(422).json({ message: e.message });
          }
        });
      if (!payloadValue) {
        return;
      }

      const user = payloadValue.email as IUser;
      const password = _get(user, "password");
      const userPassword = jwt.verify(
        password,
        process.env.JWT_SECRET_PASSWORD
      );

      if (userPassword !== payloadValue.password) {
        res.status(422).json({ message: "Invalid password" });
        return;
      }

      const token = jwt.sign(user.id.toString(), process.env.JWT_SECRET_TOKEN);
      delete user.password;
      res
        .cookie("auth", token, {
          expires: new Date("12/31/2100"),
          signed: true,
        })
        .status(200)
        .setHeader("x-auth-token", token)
        .status(200)
        .json({ message: "login successfully", user });
    } catch (error) {
      console.error("error", "error in register", error);
      res.status(500).json({
        message: error.message,
      });
    }
  };
}
