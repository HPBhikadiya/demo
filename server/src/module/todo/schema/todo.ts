import { DataTypes } from "sequelize";
import { connectDb } from "../../../dbConnection";
export const ToDoModel = connectDb().define(
  "todos",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      
    },
  },
  {
    timestamps: true,
  }
);

(async () => {
  await ToDoModel.sync();
})();
