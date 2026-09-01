import prisma from '../../prisma';
import { hashPassword, validatePassword } from '../../utils/password.utils';
import { userProfileInfo } from '../../types/users.types';
import { BadRequestError } from '../../utils/ServerError';
import { deletePublicFileFromCloud, uploadPublicFileToCloud } from '../../utils/storage.util';

export const getProfile = async (uuid: string): Promise<userProfileInfo> => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      uuid: uuid,
    },
    select: {
      username: true,
      email: true,
      phone_number: true,
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
  updateData: { username?: string; email?: string; phoneNumber?: string },
): Promise<userProfileInfo> => {
  const updatedUser = await prisma.users.update({
    where: {
      uuid: userUuid,
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
  await prisma.users.delete({
    where: {
      uuid: userUuid,
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

  const isPasswordValid = await validatePassword(oldPassword, user.password);

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
): Promise<userProfileInfo> => {
  const user = await prisma.users.findFirstOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  // if the user already has a profile picture we first delete the old one
  if (user.profile_image_url) {
    await deletePublicFileFromCloud(user.profile_image_url);
  }

  // sending the file to the Cloud, it returns the public URL
  const cloudPublicUrl = await uploadPublicFileToCloud(fileData, 'profiles');

  // saving the public URL in the database
  const updatedUser = await prisma.users.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      profile_image_url: cloudPublicUrl,
    },
    select: {
      username: true,
      email: true,
      phone_number: true,
      uuid: true,
      created_at: true,
      updated_at: true,
      profile_image_url: true,
    },
  });

  return updatedUser;
};

export const deleteProfilePicture = async (userUuid: string): Promise<userProfileInfo> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  if (!user.profile_image_url) {
    throw new BadRequestError('User does not have a profile picture to remove!');
  }

  await deletePublicFileFromCloud(user.profile_image_url);

  const updatedUser = await prisma.users.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      profile_image_url: null,
    },
    select: {
      username: true,
      email: true,
      phone_number: true,
      uuid: true,
      created_at: true,
      updated_at: true,
      profile_image_url: true,
    },
  });

  return updatedUser;
};
