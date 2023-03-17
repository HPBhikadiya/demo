import { ToDo } from ".";
import { ToDoModel } from "./schema";

/**
 *
 * @param todo todo class
 * @returns created todo
 */
export const getToDoByUser = async (userId: string) => {
  const todos = await ToDoModel.findAll({ where: { userId } }).then(
    (todos) => todos && todos.map((todo) => todo.toJSON())
  );
  return todos ? todos.map((todo) => new ToDo(todo)) : null;
};
