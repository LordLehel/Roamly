import prisma from '../../prisma';
import { users } from '@prisma/client';

export const getAllUsers = async (): Promise<users[]> => {
  const users = await prisma.users.findMany();

  return users;
};

export const getProfile = async (uuid: string): Promise<users | null> => {
  const profile = await prisma.users.findUnique({
    where: {
      uuid: uuid,
    },
  });

  return profile;
}
