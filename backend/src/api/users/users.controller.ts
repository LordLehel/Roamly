import { Request, Response } from 'express';
import * as userService from './users.service';
import { Prisma } from '@prisma/client';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({
        status: 'error',
        message: 'User was not found!',
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue with the server during the listing of the asked user!',
    });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({
        status: 'error',
        message: 'User was not found!',
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue with the server during updating the user!',
    });
  }
};

export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({
        status: 'error',
        message: 'User was not found!',
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue with the server during the deletion of the user!',
    });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({
        status: 'error',
        message: 'User was not found!',
      });
      return;
    }
    if (error instanceof Error) {
      const errorMessage = error.message;

      if (errorMessage === 'OLD_PASSWORD_INVALID') {
        res.status(400).json({
          status: 'error',
          message: 'Provided old password does not match the valid current password!',
        });

        return;
      }
    }

    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue with the server while changing the password!',
    });
  }
};

// export const uploadProfilePicture = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const user = res.locals.user;

//     if (!user?.uuid) {
//       res.status(401).json({
//         status: 'error',
//         message: 'Authorization needed!',
//       });

//       return;
//     }

//     const file = req.file;

//     if (!file) {
//       res.status(400).json({
//         status: 'error',
//         message: 'No image provided!',
//       });
//     }

//     const pictureUrl = `/uploads/${file.filename}`;

//     const updateUser
//   }
// }