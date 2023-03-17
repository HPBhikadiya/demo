import { User } from ".";
import { UserModel } from "./schema";

/**
 *
 * @param user user class
 * @returns created user
 */
export const saveUser = async (user: User) => {
  const users = await UserModel.create({
    ...user.toJSON(),
  }).then((user) => user && user.toJSON());
  return users ? new User(users) : null;
};
