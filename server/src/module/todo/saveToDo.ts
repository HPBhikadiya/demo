import { ToDo } from ".";
import { ToDoModel } from "./schema";

/**
 *
 * @param todo todo class
 * @returns created todo
 */
export const saveToDo = async (todo: ToDo) => {
  const todos = await ToDoModel.create({
    ...todo.toJSON(),
  }).then((result) => result && result.toJSON());
  return todos ? new ToDo(todos) : null;
};
