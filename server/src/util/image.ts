const multer = require("multer");
const fs = require("fs");
const path = require("path");

const destinationPath =
  "/home/mohamed/coding/git/github.com/MohamedBeydoun/shopify-summer-2021-challenge/server/uploads";

const upload = multer({
  dest: destinationPath,
});

const image = {
  upload: (req, res) => {
    upload.single("file"),
      (req, res) => {
        const tempPath = req.file.path;
        const targetPath = path.join(
          __dirname,
          destinationPath + `/${image.userId}_${image._id}.png`,
        );

        if (path.extname(req.file.originalname).toLowerCase() === ".png") {
          fs.rename(tempPath, targetPath, (err) => {
            if (err) return false;
          });
        } else {
          fs.unlink(tempPath, (err) => {
            if (err) return false;
        }
      },
    }
  },
};
