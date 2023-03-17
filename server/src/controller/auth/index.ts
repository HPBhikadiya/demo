import Controller from "./controller";
import { Router } from "express";

export default class Auth extends Controller {
  public router = Router();

  constructor() {
    super();
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post("/register", this.register);
    this.router.post("/login", this.login);
  }
}
