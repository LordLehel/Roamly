import { Prisma } from '@prisma/client';

export type userProfileInfo = Prisma.usersGetPayload<{
  select: {
    username: true;
    email: true;
    tel: true;
    uuid: true;
    created_at: true;
    profile_image_url: true;
  };
}>;
