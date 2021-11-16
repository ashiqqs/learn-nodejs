const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

function uploader(subPath, allowedType, maxSize, errMsg) {
  const UPLOADS_FOLDER = `${__dirname}/../public/uploads/${subPath}/`;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "_" +
        Date.now() +
        fileExt;
      cb(null, fileName);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: maxSize,
    },
    fileFilter: (req, file, cb) => {
      if (allowedType.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(errMsg));
      }
    },
  });

  return upload;
}

module.exports = uploader;
