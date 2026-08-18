import { Prisma } from '@prisma/client';

export type userProfileInfo = Prisma.usersGetPayload<{
  select: {
    username: true;
    email: true;
    phone_number: true;
    uuid: true;
    created_at: true;
    updated_at: true;
    profile_image_url: true;
  };
}>;
