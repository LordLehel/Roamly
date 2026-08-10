import prisma from '../../prisma';
import { users } from '@prisma/client';
import { pwdHasher, pwdValidator } from '../../utils/pwdhandling.utils'

export const registerUser = async (
  username: string,
  email: string,
  password: string,
): Promise<users> => {

  const hashedPasswd = await pwdHasher(password);

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

  const isMatch = await pwdValidator(password, user.password);

  if (!isMatch) {
    return null;
  }

  return user;
};
