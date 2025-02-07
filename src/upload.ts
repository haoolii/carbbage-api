import multer from "multer";
import path from "path";
import { Code } from "./types/code";
import { v4 as uuid } from 'uuid';

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      `${uuid()}${path.extname(file.originalname)}`
    );
  },
});

export const upload = multer({
  // storage: multer.memoryStorage(),
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const type = (`${req?.query?.type || 'image'}`).toLowerCase();

    let allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (type === 'media') {
      allowedTypes = [
        // music
        "audio/mpeg", "audio/wav", "audio/webm", "audio/aac", "audio/ogg",
        // video
        "video/mp4", "video/webm", "video/ogg"
      ];
    }

    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true); // accept file
    } else {
      callback(new Error(Code.INVALID_REQUEST_DATA)); // reject file
    }

  }
})