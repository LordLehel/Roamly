import prisma from '../../prisma';
import { users } from '@prisma/client';

export const getProfile = async (uuid: string): Promise<users | null> => {
  const profile = await prisma.users.findUnique({
    where: {
      uuid: uuid,
    },
  });

  return profile;
};
