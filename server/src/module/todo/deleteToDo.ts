import { ToDoModel } from "./schema";

export const deleteToDo = async (id: string) => {
  const todo = await ToDoModel.destroy({ where: { id } });
  return todo;
};
