import prisma from '../../prisma';
import { users } from '@prisma/client';
import { hashPassword, passwordValidator } from '../../utils/password.utils';
import { userProfileInfo } from '../../types/users.types';

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
      profile_image_url: true,
    },
  });

  return user;
};

export const updateProfile = async (
  userUuid: string,
  updateData: { username?: string; email?: string; tel?: string },
): Promise<users> => {
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
    throw new Error('OLD_PASSWORD_INVALID');
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
