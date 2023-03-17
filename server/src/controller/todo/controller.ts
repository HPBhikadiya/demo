import { Response } from "express";
import { Request } from "./../../request";
import Joi, { isError } from "joi";
import { get as _get } from "lodash";
import {
  saveToDo,
  ToDo,
  getToDoById,
  updateToDo,
  getToDoByUser,
  deleteToDo,
} from "../../module/todo";

export default class Controller {
  private readonly createSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().required().valid("TODO", "INPROGRESS", "DONE"),
  });

  private readonly updateSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().required().valid("TODO", "INPROGRESS", "DONE"),
  });

  protected readonly create = async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      console.log("payload", payload);
      const payloadValue = await this.createSchema
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

      const authUser = req.authUser;

      const todo = await saveToDo(
        new ToDo({
          ...payloadValue,
          userId: authUser.id,
        })
      );

      res.status(200).json({ message: "Added", todo });
    } catch (error) {
      console.error("error", "error in create todo", error);
      res.status(500).json({
        message: error.message,
      });
    }
  };

  protected readonly update = async (req: Request, res: Response) => {
    try {
      const { ToDoId } = req.params;
      if (!ToDoId) {
        res.status(422).json({ message: "Invalid ToDo" });
        return;
      }
      const todo = await getToDoById(ToDoId);
      if (!todo) {
        res.status(422).json({ message: "Invalid ToDo" });
        return;
      }

      const payload = req.body;

      const payloadValue = await this.updateSchema
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

      const authUser = req.authUser;
      if (authUser.id.toString() !== todo.userId.toString()) {
        res.status(422).json({ message: "Unauthorized Request" });
        return;
      }

      const updatableToDo = await updateToDo(
        new ToDo({
          ...todo,
          ...payloadValue,
        })
      );

      res.status(200).json({ message: "Updated", todo: updatableToDo });
    } catch (error) {
      console.error("error", "error in create todo", error);
      res.status(500).json({
        message: error.message,
      });
    }
  };

  protected readonly get = async (req: Request, res: Response) => {
    try {
      const { ToDoId } = req.params;
      if (!ToDoId) {
        const todos = await getToDoByUser(req.authUser.id);
        res.status(200).json({ message: "Fetched", todos });
        return;
      }
      const todo = await getToDoById(ToDoId);
      if (!todo) {
        res.status(422).json({ message: "Invalid ToDo" });
        return;
      }

      const authUser = req.authUser;
      if (authUser.id.toString() !== todo.userId.toString()) {
        res.status(422).json({ message: "Unauthorized Request" });
        return;
      }

      res.status(200).json({ message: "Fetched", todo });
    } catch (error) {
      console.error("error", "error in get todo", error);
      res.status(500).json({
        message: error.message,
      });
    }
  };

  protected readonly delete = async (req: Request, res: Response) => {
    try {
      const { ToDoId } = req.params;
      if (!ToDoId) {
        res.status(422).json({ message: "Invalid ToDo" });
        return;
      }
      const todo = await getToDoById(ToDoId);
      if (!todo) {
        res.status(422).json({ message: "Invalid ToDo" });
        return;
      }

      const authUser = req.authUser;
      if (authUser.id.toString() !== todo.userId.toString()) {
        res.status(422).json({ message: "Unauthorized Request" });
        return;
      }

      await deleteToDo(ToDoId);

      res.status(200).json({ message: "Deleted" });
    } catch (error) {
      console.error("error", "error in delete todo", error);
      res.status(500).json({
        message: error.message,
      });
    }
  };
}
