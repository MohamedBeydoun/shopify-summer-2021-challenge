import { Router } from "express";
import { userController } from "../controllers/user";
import { userValidator } from "../validators/user";
import { authMiddleware } from "../middleware/auth";

const userRouter: Router = Router();

userRouter.get("/", userValidator("GET /users"), userController.index);

userRouter.get(
  "/:userId",
  userValidator("GET /users/:userId"),
  authMiddleware.introspect,
  userController.show,
);

userRouter.post("/", userValidator("POST /users"), userController.create);

userRouter.put(
  "/:userId",
  userValidator("PUT /users/:userId"),
  authMiddleware.introspect,
  userController.update,
);

userRouter.delete(
  "/:userId",
  userValidator("DELETE /users/:userId"),
  authMiddleware.introspect,
  userController.delete,
);

export { userRouter };
