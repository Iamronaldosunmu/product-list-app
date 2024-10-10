import mongoose from "mongoose";
import config from "config"

export default function connectToDB() {
  mongoose
    .connect(config.get("MONGO_URI"))
    .then(() => console.log("Connected to the DB..."))
    .catch((err) => {
      console.error(err.message);
    });
}