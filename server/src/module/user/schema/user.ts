import { DataTypes } from "sequelize";
import { connectDb } from "../../../dbConnection";
export const UserModel = connectDb().define(
  "users",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "email",
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

(async () => {
  await UserModel.sync();
})();
