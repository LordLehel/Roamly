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
