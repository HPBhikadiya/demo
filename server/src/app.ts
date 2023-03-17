import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import Auth from "./controller/auth";
import ToDo from "./controller/todo";
import { validateAuthIdToken } from "./middleware/validateAuthIdToken";

export default class App {
  public static instance: express.Application;
  private static port: number;
  public static start(port) {
    this.instance = express();
    this.port = port;

    // Add middleware.
    this.initializeMiddleware();

    // Add controllers
    this.initializeControllers();
  }

  private static initializeMiddleware() {
    // logger

    // CORS
    this.instance.use(
      cors({
        origin: true,
        credentials: true,
        exposedHeaders: "x-auth-token",
      })
    );

    // Cookie parser.
    this.instance.use(cookieParser(process.env.COOKIE_SECRET));

    // Body Parser
    this.instance.use(express.json({ limit: "50mb" }));
    this.instance.use(express.static(process.cwd() + "/public"));
  }

  private static initializeControllers() {
    this.instance.use("/auth", new Auth().router);
    this.instance.use("/todo", validateAuthIdToken, new ToDo().router);
  }
}
