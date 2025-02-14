import multer from "multer";
import { Code } from "./types/code";

export const upload = multer({
  storage:multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const type = (`${req?.query?.type || 'image'}`).toLowerCase();

    // TODO: filter type
    console.log('type', type)

    let allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    allowedTypes = [
      ...allowedTypes,
      // music
      "audio/mpeg", "audio/wav", "audio/webm", "audio/aac", "audio/ogg",
      // video
      "video/mp4", "video/webm", "video/ogg"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true); // accept file
    } else {
      callback(new Error(Code.INVALID_REQUEST_DATA)); // reject file
    }

  }
})