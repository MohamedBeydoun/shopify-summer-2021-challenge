import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { errorMessage } from "../config/errorFormatter";
import { userDBInteractions } from "../database/interactions/user";
import { IUserModel } from "../database/models/user";
import { bcryptPassword } from "../config/bcrypt";
import { statusCodes } from "../config/statusCodes";

const authController = {
  login: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(statusCodes.MISSING_PARAMS)
        .json(errors.formatWith(errorMessage).array()[0]);
    } else {
      try {
        const { email, password } = req.body;
        const user: IUserModel = await userDBInteractions.findByEmail(
          email,
          "+password",
        );
        if (!user) {
          res.status(statusCodes.BAD_REQUEST).json({
            status: statusCodes.BAD_REQUEST,
            message: "Invalid email or password",
          });
        } else {
          if (!bcryptPassword.validate(password, user.password)) {
            res.status(statusCodes.BAD_REQUEST).json({
              status: statusCodes.BAD_REQUEST,
              message: "Invalid email or password",
            });
          } else {
            const token = jwt.sign(
              {
                id: user._id,
                email: user.email,
              },
              process.env.SECRET,
            );
            const userJSON = user.toJSON();
            delete userJSON.password;
            res.status(statusCodes.SUCCESS).json({
              token: token,
              user: userJSON,
            });
          }
        }
      } catch (error) {
        res.status(statusCodes.SERVER_ERROR).json(error);
      }
    }
  },
};

export { authController };
