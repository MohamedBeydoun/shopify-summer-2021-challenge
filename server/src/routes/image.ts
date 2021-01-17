import { Router } from "express";
import { imageController } from "../controllers/image";
import { imageValidator } from "../validators/image";
import { authMiddleware } from "../middleware/auth";
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, process.env.UPLOAD_DIR);
  },
  filename: function (req, file, callback) {
    callback(
      null,
      `${req.body.userId}/${file.originalname.split(".")[0]}_${
        Date.now() + path.extname(file.originalname)
      }`,
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Allowed extensions
    var filetypes = /jpeg|jpg|png|gif/;
    // check extensions
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mime type
    var mimetype = filetypes.test(file.mimetype);
    if (extname && extname) {
      return cb(null, true);
    }
    cb("Error: Images only");
  },
});

const imageRouter: Router = Router();

imageRouter.get(
  "/",
  imageValidator("GET /images"),
  authMiddleware.introspect,
  imageController.index,
);

imageRouter.get(
  "/:imageId",
  imageValidator("GET /images/:imageId"),
  authMiddleware.introspect,
  imageController.showImage,
);

imageRouter.get(
  "/:imageId/info",
  imageValidator("GET /images/:imageId"),
  authMiddleware.introspect,
  imageController.showInfo,
);

imageRouter.post(
  "/",
  imageValidator("POST /images"),
  authMiddleware.introspect,
  upload.single("file"),
  imageController.create,
);

imageRouter.delete(
  "/:imageId",
  imageValidator("DELETE /images/:imageId"),
  authMiddleware.introspect,
  imageController.delete,
);

export { imageRouter };
