import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();
export const connectDb = () =>
  new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,

    {
      host: "localhost",
      // port:3306,
      dialect: "mysql",
    }
  );
