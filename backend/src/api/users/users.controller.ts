import { Request, Response } from 'express';
import * as userService from './users.service';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const user = res.locals.user;
  if (!user?.uuid) {
    res.status(401).json({ status: 'error', message: 'Authorization needed!' });
    return;
  }

  const profile = await userService.getProfile(user.uuid);

  res.status(200).json({
    status: 'success',
    data: profile,
  });
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const user = res.locals.user;

  if (!user?.uuid) {
    res.status(401).json({ status: 'error', message: 'Authorization needed!' });
    return;
  }

  const updateData = req.body;

  const updatedUser = await userService.updateProfile(user.uuid, updateData);

  res.status(200).json({
    status: 'success',
    message: 'User successfully updated!',
    data: updatedUser,
  });
};

export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
  const user = res.locals.user;

  if (!user?.uuid) {
    res.status(401).json({ status: 'error', message: 'Authorization needed!' });

    return;
  }

  await userService.deleteProfile(user.uuid);

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully!',
  });
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const user = res.locals.user;

  if (!user?.uuid) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization needed!',
    });

    return;
  }

  const { oldPassword, newPassword } = req.body;

  await userService.changePassword(user.uuid, oldPassword, newPassword);

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully!',
  });
};

export const uploadProfilePicture = async (req: Request, res: Response): Promise<void> => {
  const user = res.locals.user;

  if (!user?.uuid) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization needed!',
    });

    return;
  }

  const file = req.file;

  if (!file) {
    res.status(400).json({
      status: 'error',
      message: 'No image provided!',
    });

    return;
  }

  const pictureUrl = `/uploads/profiles/${file.filename}`;

  const updatedUser = await userService.uploadProfilePicture(user.uuid, file, pictureUrl);

  res.status(200).json({
    status: 'success',
    message: 'Profile picture uploaded successfully!',
    data: updatedUser,
  });
};
