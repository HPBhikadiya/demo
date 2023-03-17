import { getToDoById, ToDo } from ".";
import { ToDoModel } from "./schema";

export const updateToDo = async (todo: ToDo) => {
  const todos = await ToDoModel.update(
    {
      ...todo.toJSON(),
    },
    {
      where: { id: todo.id },
    }
  );

  const updatedTodo = await getToDoById(todo.id).then(
    (todo) => todo && todo.toJSON()
  );

  return updatedTodo;
};
