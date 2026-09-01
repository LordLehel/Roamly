import multer from 'multer';
import { Request } from 'express';
import { BadRequestError } from '../utils/ServerError';

// we store data in memory before we send it to the cloud
const storage = multer.memoryStorage();

// filtering provided files, we accept only images here at the profile pictures
const ProfilePictureFilter = (
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

// document filter
const documentFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Invalid document type! Only JPG, PNG, WEBP and PDF are allowed!'));
  }
};

// media files filter
const mediaFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  // video/quicktime is <.mov> type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/quicktime',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        'Invalid media file type! Only JPG, PNG, WEBP, MP4, MOV, and GIF are allowed!',
      ),
    );
  }
};

// exporting profile picture uploader
export const uploadProfilePicture = multer({
  storage,
  fileFilter: ProfilePictureFilter,
  limits: {
    // maximum allowed file size is 5MB
    fileSize: 5 * 1024 * 1024,
  },
});

// exporting document uploader
export const uploadDocument = multer({
  storage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// exporting media file uploader
// 200MB limit so users can upload longer videos too
export const uploadMedia = multer({
  storage,
  fileFilter: mediaFilter,
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});
