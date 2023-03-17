import { isUndefined, omitBy } from "lodash";
import { IUser } from "../../user";

export interface IToDo {
  id?: string;
  title: string;
  description: string;
  status: string; //ENUM TODO, INPROGRESS, DONE
  userId: string | IUser;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ToDo implements IToDo {
  id?: string;
  title: string;
  description: string;
  status: string;
  userId: string | IUser;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input?: IToDo) {
    this.id = input.id;
    this.title = input.title;
    this.description = input.description;
    this.status = input.status;
    this.userId = input.userId;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
  }

  toJSON(): IToDo {
    return omitBy(this, isUndefined) as IToDo;
  }
}
