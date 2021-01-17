import { Request, Response } from "express";
import { userDBInteractions } from "../database/interactions/user";
import { imageDBInteractions } from "../database/interactions/image";
import { User, IUserModel } from "../database/models/user";
import { IUser } from "../interfaces/IUser";
import { IImage } from "../interfaces/IImage";
import { validationResult } from "express-validator/check";
import { errorMessage } from "../config/errorFormatter";
import { bcryptPassword } from "../config/bcrypt";
import { statusCodes } from "../config/statusCodes";
const fs = require("fs");

const userController = {
  index: async (req: Request, res: Response) => {
    try {
      const users = await userDBInteractions.all();
      res.status(statusCodes.SUCCESS).json(users);
    } catch (err) {
      res.status(statusCodes.SERVER_ERROR).json(err);
    }
  },

  show: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(statusCodes.MISSING_PARAMS)
        .json(errors.formatWith(errorMessage).array()[0]);
    } else {
      try {
        const userId: string = req.params.userId;
        const user: IUserModel = await userDBInteractions.find(userId);

        if (req.params.auth["userIdFromToken"] != user._id) {
          res.status(statusCodes.FORBIDDEN).json({
            status: statusCodes.FORBIDDEN,
            message: "Forbidden",
          });
          res.end();
          return;
        }

        const images = await imageDBInteractions.allByUser(userId);
        user
          ? res.status(statusCodes.SUCCESS).json({
              user,
              images,
            })
          : res.status(statusCodes.NOT_FOUND).json({
              status: statusCodes.NOT_FOUND,
              message: "User not found",
            });
      } catch (error) {
        res.status(statusCodes.SERVER_ERROR).json(error);
      }
    }
  },

  create: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(statusCodes.MISSING_PARAMS)
        .json(errors.formatWith(errorMessage).array()[0]);
    } else {
      try {
        const foundByEmail = await userDBInteractions.findByEmail(
          req.body.email,
        );
        const foundByUsername = await userDBInteractions.findByUsername(
          req.body.username,
        );
        if (foundByEmail) {
          return res.status(statusCodes.CONFLICT_FOUND).json({
            status: statusCodes.CONFLICT_FOUND,
            message: "User with that email already exists",
          });
        } else if (foundByUsername) {
          return res.status(statusCodes.CONFLICT_FOUND).json({
            status: statusCodes.CONFLICT_FOUND,
            message: "User with that username already exists",
          });
        } else {
          const userData: IUser = {
            ...req.body,
            password: bcryptPassword.generateHash(req.body.password),
          };
          let newUser: IUserModel = await userDBInteractions.create(
            new User(userData),
          );
          newUser = newUser.toJSON();
          delete newUser.password;

          fs.mkdirSync("uploads/" + newUser._id, { recursive: true });

          res.status(statusCodes.SUCCESS).json(newUser);
        }
      } catch (error) {
        res.status(statusCodes.SERVER_ERROR).json(error);
      }
    }
  },

  update: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(statusCodes.MISSING_PARAMS)
        .json(errors.formatWith(errorMessage).array()[0]);
    } else {
      try {
        const { userId } = req.params;
        const user: IUserModel = await userDBInteractions.find(
          userId,
          "+password",
        );
        if (!user)
          res.status(statusCodes.NOT_FOUND).json({
            status: statusCodes.NOT_FOUND,
            message: "User not found",
          });
        else {
          if (req.params.auth["userIdFromToken"] != user._id) {
            res.status(statusCodes.FORBIDDEN).json({
              status: statusCodes.FORBIDDEN,
              message: "Forbidden",
            });
            res.end();
            return;
          }

          const foundByEmail = await userDBInteractions.findByEmail(
            req.body.email,
          );
          const foundByUsername = await userDBInteractions.findByUsername(
            req.body.username,
          );
          if (foundByEmail && !foundByEmail._id.equals(user._id)) {
            return res.status(statusCodes.CONFLICT_FOUND).json({
              status: statusCodes.CONFLICT_FOUND,
              message: "User with that email already exists",
            });
          } else if (foundByUsername && !foundByUsername._id.equals(user._id)) {
            return res.status(statusCodes.CONFLICT_FOUND).json({
              status: statusCodes.CONFLICT_FOUND,
              message: "User with that username already exists",
            });
          }
          const updatedUserBody: IUser = {
            ...req.body,
          };
          if (req.body.password)
            updatedUserBody["password"] = bcryptPassword.generateHash(
              req.body.password,
            );

          const updatedUser: IUserModel = await userDBInteractions.update(
            userId,
            updatedUserBody,
          );
          res.status(statusCodes.SUCCESS).json(updatedUser);
        }
      } catch (error) {
        res.status(statusCodes.SERVER_ERROR).json(error);
      }
    }
  },

  delete: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(statusCodes.MISSING_PARAMS)
        .json(errors.formatWith(errorMessage).array()[0]);
    } else {
      try {
        const { userId } = req.params;
        const user: IUserModel = await userDBInteractions.find(userId);
        if (!user) {
          res.status(statusCodes.NOT_FOUND).json({
            status: statusCodes.NOT_FOUND,
            message: "User not found",
          });
        } else {
          if (req.params.auth["userIdFromToken"] != user._id) {
            res.status(statusCodes.FORBIDDEN).json({
              status: statusCodes.FORBIDDEN,
              message: "Forbidden",
            });
            res.end();
            return;
          }

          await userDBInteractions.delete(userId);
          res.status(statusCodes.SUCCESS).json();
        }
      } catch (error) {
        res.status(statusCodes.SERVER_ERROR).json(error);
      }
    }
  },
};

export { userController };
