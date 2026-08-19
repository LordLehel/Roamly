import multer from 'multer';
import { Request } from 'express';
import { BadRequestError } from '../utils/ServerError';

// we store data in memory before we send it to the cloud
const storage = multer.memoryStorage();

// filtering provided files, we accept only images here
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    // we accept the file
    cb(null, true);
  } else {
    cb(new BadRequestError('Invalid file type! Only JPG, PNG, WEBP and GIF are allowed!'));
  }
};

// exporting middleware
export const uploadProfilePicture = multer({
  storage,
  fileFilter,
  limits: {
    // maximum allowed file size is 5MB
    fileSize: 5 * 1024 * 1024,
  },
});
