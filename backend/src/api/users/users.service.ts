import prisma from '../../prisma';
import { users } from '@prisma/client';

export const getAllUsers = async (): Promise<users[]> => {
  const users = await prisma.users.findMany();

  return users;
};
