import App from "./app";

import { connectDb } from "./dbConnection";
import dotenv from "dotenv";
dotenv.config();
process.env.TZ = "UTC";
const serverPort = process.env.PORT || 3000;

connectDb()
  .authenticate()
  .then(async () => {
    App.start(serverPort);
    App.instance.listen(serverPort, function () {
      console.log(
        `App listening on environment "${process.env.NODE_ENV}" ${serverPort}`
      );
    });
  })
  .catch((error) => {
    console.log("error while connect to database", error);
  });
