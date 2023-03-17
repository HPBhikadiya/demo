import Controller from "./controller";
import { Router } from "express";

export default class ToDo extends Controller {
  public router = Router();

  constructor() {
    super();
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post("/", this.create);
    this.router.patch("/:ToDoId", this.update);
    this.router.get("/", this.get);
    this.router.get("/:ToDoId", this.get);
    this.router.delete("/:ToDoId", this.delete);
  }
}
