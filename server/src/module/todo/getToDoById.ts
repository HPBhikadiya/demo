import { ToDo } from ".";
import { ToDoModel } from "./schema";

/**
 *
 * @param todo todo class
 * @returns created todo
 */
export const getToDoById = async (id: string) => {
  const todos = await ToDoModel.findOne({
    where: { id },
  }).then((todo) => todo && todo.toJSON());
  return todos ? new ToDo(todos) : null;
};
