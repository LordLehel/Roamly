import { groups, roles, users } from '@prisma/client';
import prisma from '../prisma';

export const getUserOrThrow = async (userUuid: string): Promise<users> => {
  const user = await prisma.users.findUnique({
    where: { uuid: userUuid },
  });

  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  return user;
};

export const getGroupOrThrow = async (groupUuid: string): Promise<groups> => {
  const group = await prisma.groups.findUnique({
    where: { uuid: groupUuid },
  });

  if (!group) {
    throw new Error('GROUP_NOT_FOUND');
  }

  return group;
};

export const getRoleByTypeOrThrow = async (roleType: string): Promise<roles> => {
  const role = await prisma.roles.findFirst({
    where: { type: roleType },
  });

  if (!role) {
    throw new Error('ROLE_TYPE_NOT_FOUND');
  }

  return role;
};

export const getUserByEmailOrThrow = async (userEmail: string): Promise<users> => {
  const user = await prisma.users.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!user) {
    throw new Error('USER_NOT_FOUND_WITH_PROVIDED_EMAIL');
  }

  return user;
};

export const userPartOfTheGroupOrThrow = async (user: users, group: groups): Promise<void> => {
  const groupProfileForTheGroupTheUserIsPartOf = await prisma.group_profiles.findFirst({
    where: {
      user_id: user.user_id,
      group_id: group.group_id,
      roles: {
        type: {
          in: ['member', 'leader'],
        },
      },
    },
  });

  if (!groupProfileForTheGroupTheUserIsPartOf) {
    throw new Error('USER_NOT_PART_OF_THE_GROUP');
  }
};

export const leaderOfTheGroupOrThrow = async (user: users, group: groups): Promise<void> => {
  const isTheUserLeaderInTheGroup = await prisma.group_profiles.findFirst({
    where: {
      group_id: group.group_id,
      user_id: user.user_id,

      roles: {
        type: 'leader',
      },
    },
  });

  if (!isTheUserLeaderInTheGroup) {
    throw new Error('USER_IS_NOT_LEADER_IN_GROUP');
  }
};
