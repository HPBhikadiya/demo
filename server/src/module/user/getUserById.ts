import { User } from ".";
import { UserModel } from "./schema";

/**
 *
 * @param email user email
 * @returns null or User class
 */
export const getUserById = async (id: string) => {
  const user = await UserModel.findOne({
    where: { id },
  }).then((user) => user && user.toJSON());
  return user ? new User(user) : null;
};
