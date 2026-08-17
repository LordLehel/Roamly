import prisma from '../../prisma';
import { hashPassword, passwordValidator } from '../../utils/password.utils';
import { userProfileInfo } from '../../types/users.types';
import { BadRequestError } from '../../utils/ServerError';

export const getProfile = async (uuid: string): Promise<userProfileInfo> => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      uuid: uuid,
    },
    select: {
      username: true,
      email: true,
      tel: true,
      uuid: true,
      created_at: true,
      updated_at: true,
      profile_image_url: true,
    },
  });

  return user;
};

export const updateProfile = async (
  userUuid: string,
  updateData: { username?: string; email?: string; tel?: string },
): Promise<userProfileInfo> => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const updatedUser = await prisma.users.update({
    where: {
      user_id: user.user_id,
    },
    data: updateData,
    omit: {
      password: true,
      user_id: true,
    },
  });

  return updatedUser;
};

export const deleteProfile = async (userUuid: string): Promise<void> => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  await prisma.users.delete({
    where: {
      user_id: user.user_id,
    },
  });
};

export const changePassword = async (
  userUuid: string,
  oldPassword: string,
  newPassword: string,
): Promise<void> => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const isPasswordValid = await passwordValidator(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new BadRequestError('Old password invalid!');
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.users.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const uploadProfilePicture = async (
  userUuid: string,
  fileData: Express.Multer.File,
  pictureUrl: string,
): Promise<userProfileInfo> => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const [, updatedUser] = await prisma.$transaction([
    // we create the file in the files table
    prisma.files.create({
      data: {
        file_name: fileData.filename,
        file_url: pictureUrl,
        file_size: fileData.size,
        mime_type: fileData.mimetype,
        ownership_type: 'personal',
        uploaded_by: user.user_id,
        user_id: user.user_id,
        media_files: {
          create: {
            description: `${user.email}'s profile picture`,
          },
        },
      },
    }),

    // update the user
    prisma.users.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        profile_image_url: pictureUrl,
      },
      select: {
        username: true,
        email: true,
        tel: true,
        uuid: true,
        created_at: true,
        updated_at: true,
        profile_image_url: true,
      },
    }),
  ]);

  return updatedUser;
};
