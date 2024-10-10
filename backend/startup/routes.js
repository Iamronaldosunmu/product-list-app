import authMiddleware from "../middleware/auth.js";
import error from "../middleware/error.js";
import userRouter from "../routes/user.js";

export default function (app) {
  app.use("/user", userRouter);
  app.use(error);
}