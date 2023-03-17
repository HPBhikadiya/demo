import { isUndefined, omitBy } from "lodash";

export interface IUser {
  id?: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User implements IUser {
  id?: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input?: IUser) {
    this.id = input.id;
    this.email = input.email;
    this.password = input.password;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
  }

  toJSON(): IUser {
    return omitBy(this, isUndefined) as IUser;
  }
}
