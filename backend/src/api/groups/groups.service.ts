import prisma from '../../prisma';
import { groups } from '@prisma/client';
import { profileRelatedToTheGroup, PaginatedGroups } from '../../types/group.types';
import { getGroupOrThrow, getRoleByTypeOrThrow, getUserOrThrow } from '../../utils/db.validations';

export const createGroup = async (creatorUuid: string, name: string): Promise<groups> => {
  const user = await getUserOrThrow(creatorUuid);

  const leaderRole = await getRoleByTypeOrThrow('leader');

  const newGroup = prisma.groups.create({
    data: {
      name,
      current_size: 1,
      group_profiles: {
        create: {
          user_id: user.user_id,
          role_id: leaderRole.role_id,
        },
      },
    },
    include: {
      group_profiles: {
        include: {
          roles: true,
        },
      },
    },
  });

  return newGroup;
};

export const listAllGroupsTheUserIsPartOf = async (
  userUuid: string,
  page: number,
  limit: number,
): Promise<PaginatedGroups> => {
  const user = await getUserOrThrow(userUuid);

  const userFilter = {
    group_profiles: {
      some: {
        users: {
          uuid: user.uuid,
        },

        roles: {
          type: {
            in: ['leader', 'member'],
          },
        },
      },
    },
  };

  // we calculate the total number of items in the table so we can decide
  // if the page query parameter given by the user is valid or not
  const numberOfItems = await prisma.groups.count({
    where: userFilter,
  });

  // calculating the number off existing pages the user could ask for
  // if there is 0 items in the table there could be only valid 1 page
  const totalValidPages = Math.ceil(numberOfItems / limit) || 1;

  if (page > totalValidPages) {
    return {
      items: [],
      meta: {
        total_items: numberOfItems,
        total_pages: totalValidPages,
        current_page: page,
        items_per_page: limit,
      },
    };
  }

  // calculating how many elements we should skip
  const skip = (page - 1) * limit;

  const groupList = await prisma.groups.findMany({
    skip: skip,
    take: limit,

    where: userFilter,

    select: {
      uuid: true,
      name: true,
      current_size: true,
      created_at: true,

      group_profiles: {
        where: {
          roles: {
            type: 'leader',
          },
        },
        select: {
          nickname: true,
          description: true,

          users: {
            select: {
              uuid: true,
              username: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return {
    items: groupList,
    meta: {
      total_items: numberOfItems,
      total_pages: totalValidPages,
      current_page: page,
      items_per_page: limit,
    },
  };
};

export const joinAGroupByUuidIfUserIsInvited = async (
  userUuid: string,
  groupUuid: string,
): Promise<profileRelatedToTheGroup> => {
  const user = await getUserOrThrow(userUuid);

  const group = await getGroupOrThrow(groupUuid);

  const invitedProfil = await prisma.group_profiles.findFirst({
    where: {
      users: { uuid: user.uuid },
      groups: { uuid: group.uuid },
      roles: {
        type: { in: ['invitedLeader', 'invitedMember'] },
      },
    },
    include: {
      roles: true,
    },
  });

  if (!invitedProfil) {
    throw new Error('USER_NOT_INVITED_OR_ALREADY_PART_OF_THE_GROUP');
  }

  let newRoleName = 'dummyRole';

  if (invitedProfil.roles.type === 'invitedLeader') {
    newRoleName = 'leader';
  } else if (invitedProfil.roles.type === 'invitedMember') {
    newRoleName = 'member';
  }

  const existingRole = await getRoleByTypeOrThrow(newRoleName);

  const updatedProfile = await prisma.group_profiles.update({
    where: {
      user_id_group_id: {
        user_id: user.user_id,
        group_id: group.group_id,
      },
    },
    data: {
      role_id: existingRole.role_id,
    },
    include: {
      roles: true,
    },
  });

  return updatedProfile;
};

export const inviteUsersToYourGroup = async (
  userUuid: string,
  invitedUserUuid: string,
  groupUuid: string,
  inviteWithRole: string,
): Promise<profileRelatedToTheGroup> => {
  const user = await getUserOrThrow(userUuid);

  const invitedUser = await getUserOrThrow(invitedUserUuid);

  const group = await getGroupOrThrow(groupUuid);

  const role = await getRoleByTypeOrThrow(inviteWithRole);

  if (!['invitedLeader', 'invitedMember'].includes(inviteWithRole)) {
    throw new Error('INVALID_INVITATION_ROLE');
  }

  const inviterProfile = await prisma.group_profiles.findUnique({
    where: {
      user_id_group_id: {
        user_id: user.user_id,
        group_id: group.group_id,
      },
    },
    include: {
      roles: true,
    },
  });

  if (!inviterProfile || inviterProfile.roles.type !== 'leader') {
    throw new Error('NOT_A_LEADER_OF_THE_GROUP');
  }

  const alreadyInTheGroup = await prisma.group_profiles.findUnique({
    where: {
      user_id_group_id: {
        user_id: invitedUser.user_id,
        group_id: group.group_id,
      },
    },
  });

  if (alreadyInTheGroup) {
    throw new Error('USER_ALREADY_INVITED_IN_GROUP_OR');
  }

  const createdProfile = await prisma.group_profiles.create({
    data: {
      user_id: invitedUser.user_id,
      group_id: group.group_id,
      role_id: role.role_id,
    },
    include: {
      roles: true,
    },
  });

  return createdProfile;
};
