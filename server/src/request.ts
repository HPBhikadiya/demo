import { Request as expressRequest } from "express";
import { IUser } from "./module/user";

export interface Request extends expressRequest {
  authUser?: IUser;
}
