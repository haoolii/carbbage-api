import multer from "multer";
import { Code } from "./types/code";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 120 * 1024 * 1024, files: 3 }, // 120 MB
  fileFilter: (req, file, callback) => {
    let allowedTypes = [
      // image
      "image/jpeg",
      "image/png",
      "image/webp",
      // music
      "audio/mpeg",
      "audio/wav",
      "audio/webm",
      "audio/aac",
      "audio/ogg",
      // video
      "video/mp4",
      "video/webm",
      "video/ogg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true); // accept file
    } else {
      callback(new Error(Code.FILE_NOT_SUPPORTED)); // reject file
    }
  },
});
