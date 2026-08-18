import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';

// where do we save the file and what will its name be
const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    _cb: (error: Error | null, destination: string) => void,
  ): void => {
    // does the directory exist?
    _cb(null, 'uploads/profiles/');
  },
  filename: (
    _req: Request,
    _file: Express.Multer.File,
    _cb: (error: Error | null, destination: string) => void,
  ): void => {
    // generate filename for security
    const uniqueSuffix = crypto.randomBytes(16).toString('hex') + '-' + Date.now();
    const extension = path.extname(_file.originalname);
    _cb(null, `${uniqueSuffix}${extension}`);
  },
});

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
    cb(new Error('INVALID_FILE_TYPE'));
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
