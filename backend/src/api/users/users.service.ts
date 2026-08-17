import prisma from '../../prisma';
import { userProfileInfo } from '../../types/users.types';

export const getProfile = async (uuid: string): Promise<userProfileInfo> => {
  const profile = await prisma.users.findFirstOrThrow({
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

  return profile;
};
