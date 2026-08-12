import prisma from '../../prisma';
import { users } from '@prisma/client';
import { hashPassword, passwordValidator } from '../../utils/password.utils';

export const registerUser = async (
  username: string,
  email: string,
  password: string,
): Promise<users> => {
  const hashedPasswd = await hashPassword(password);

  const newUser = await prisma.users.create({
    data: {
      username,
      email,
      password: hashedPasswd,
    },
  });

  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<users | null> => {
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return null;
  }

  const isMatch = await passwordValidator(password, user.password);

  if (!isMatch) {
    return null;
  }

  return user;
};
