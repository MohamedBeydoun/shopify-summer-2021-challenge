import { Request, Response } from "express";
import { imageDBInteractions } from "../database/interactions/image";
import { Image, IImageModel } from "../database/models/image";
import { validationResult } from "express-validator/check";
import { errorMessage } from "../config/errorFormatter";
import { statusCodes } from "../config/statusCodes";
const path = require("path");

const imageController = {
  index: async (req: Request, res: Response) => {
    try {
      const images = await imageDBInteractions.all();
      res.status(statusCodes.SUCCESS).json(images);
    } catch (err) {
      res.status(statusCodes.SERVER_ERROR).json(err);
    }
  },

  showImage: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(statusCodes.MISSING_PARAMS)
        .json(errors.formatWith(errorMessage).array()[0]);
    } else {
      try {
        const imageId: string = req.params.imageId;
        const image: IImageModel = await imageDBInteractions.find(imageId);

        if (req.params.auth["userIdFromToken"] != image.userId) {
          res.status(statusCodes.FORBIDDEN).json({
            status: statusCodes.FORBIDDEN,
            message: "Forbidden",
          });
          res.end();
          return;
        }

        res.sendFile(path.join(`${process.env.UPLOAD_DIR}/${image.path}`));
      } catch (error) {
        res.status(statusCodes.SERVER_ERROR).json(error);
      }
    }
  },

  showInfo: async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(statusCodes.MISSING_PARAMS)
        .json(errors.formatWith(errorMessage).array()[0]);
    } else {
      try {
        const imageId: string = req.params.imageId;
        const image: IImageModel = await imageDBInteractions.find(imageId);

        if (req.params.auth["userIdFromToken"] != image.userId) {
          res.status(statusCodes.FORBIDDEN).json({
            status: statusCodes.FORBIDDEN,
            message: "Forbidden",
          });
          res.end();
          return;
        }

        image
          ? res.status(statusCodes.SUCCESS).json(image)
          : res.status(statusCodes.NOT_FOUND).json({
              status: statusCodes.NOT_FOUND,
              message: "Image not found",
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
        const image = new Image({
          ...req.body,
          path: `${req.file.filename}`,
        });
        const newImage: IImageModel = await imageDBInteractions.create(image);

        if (req.params.auth["userIdFromToken"] != image.userId) {
          res.status(statusCodes.FORBIDDEN).json({
            status: statusCodes.FORBIDDEN,
            message: "Forbidden",
          });
          res.end();
          return;
        }

        res.status(statusCodes.SUCCESS).json(newImage);
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
        const { imageId } = req.params;
        const image: IImageModel = await imageDBInteractions.find(imageId);
        if (!image) {
          res.status(statusCodes.NOT_FOUND).json({
            status: statusCodes.NOT_FOUND,
            message: "Image not found",
          });
        } else {
          if (req.params.auth["userIdFromToken"] != image.userId) {
            res.status(statusCodes.FORBIDDEN).json({
              status: statusCodes.FORBIDDEN,
              message: "Forbidden",
            });
            res.end();
            return;
          }

          await imageDBInteractions.delete(imageId);
          res.status(statusCodes.SUCCESS).json();
        }
      } catch (error) {
        res.status(statusCodes.SERVER_ERROR).json(error);
      }
    }
  },
};

export { imageController };
