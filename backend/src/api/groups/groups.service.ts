import prisma from '../../prisma';
import { groups, Prisma } from '@prisma/client';
import {
  profileRelatedToTheGroup,
  PaginatedGroups,
  GroupProfilesInfos,
  InfosOfTheGroupTheUserIsPartOf,
} from '../../types/group.types';
import {
  getGroupOrThrow,
  getRoleByTypeOrThrow,
  getUserByEmailOrThrow,
  getUserGroupProfile,
  getUserOrThrow,
  leaderOfTheGroupOrThrow,
  userPartOfTheGroupOrThrow,
} from '../../utils/db.validations';

export const createGroup = async (
  creatorUuid: string,
  name: string,
  initialInvites?: { email: string; role: string }[],
): Promise<groups> => {
  const user = await getUserOrThrow(creatorUuid);

  const leaderRole = await getRoleByTypeOrThrow('leader');

  const newGroup = await prisma.groups.create({
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

  if (initialInvites && initialInvites.length > 0) {
    await Promise.all(
      initialInvites.map(async (invitee: { email: string; role: string }) => {
        await inviteUsersToYourGroup(creatorUuid, invitee.email, newGroup.uuid, invitee.role);
      }),
    );
  }

  return newGroup;
};

// cursor is optional (?) because the first listing won't include it
export const listAllGroupsTheUserIsPartOf = async (
  userUuid: string,
  limit: number,
  cursor?: string,
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

  const queryOptions: Prisma.groupsFindManyArgs = {
    take: limit,
    where: userFilter,

    select: {
      uuid: true,
      name: true,
      current_size: true,
      created_at: true,

      group_profiles: {
        where: {
          users: { uuid: user.uuid },
        },
        select: {
          roles: {
            select: {
              type: true,
            },
          },
        },
      },
    },
    orderBy: [{ created_at: 'desc' }, { uuid: 'desc' }],
  };

  // if the frontend sent a cursor we put it into the query
  if (cursor) {
    queryOptions.cursor = {
      uuid: cursor,
    };

    // we skip the cursor, it was already part of the previous list
    queryOptions.skip = 1;
  }

  const groupList = await prisma.groups.findMany(queryOptions);

  // next cursor could be either null, if there isn't any data left in the database
  // or the last elements uuid
  let nextCursor = null;

  if (groupList.length === limit) {
    nextCursor = groupList[groupList.length - 1].uuid;
  }

  return {
    items: groupList,
    meta: {
      next_cursor: nextCursor,
      // has_next_page will be false if the database doesn't contain any more data to be sent
      has_next_page: nextCursor !== null,
      limit: limit,
      // number of sent data
      count: groupList.length,
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

  const [updatedProfile] = await prisma.$transaction([
    // updating profile
    prisma.group_profiles.update({
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
    }),

    // incrementing group size
    prisma.groups.update({
      where: {
        group_id: group.group_id,
      },

      data: {
        current_size: { increment: 1 },
      },
    }),
  ]);

  return updatedProfile;
};

export const inviteUsersToYourGroup = async (
  userUuid: string,
  invitedUserEmail: string,
  groupUuid: string,
  inviteWithRole: string,
): Promise<profileRelatedToTheGroup> => {
  const user = await getUserOrThrow(userUuid);

  const invitedUser = await getUserByEmailOrThrow(invitedUserEmail);

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
    throw new Error('USER_ALREADY_IN_GROUP_OR_INVITED');
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

export const pendingInvites = async (
  userUuid: string,
  limit: number,
  cursor?: string,
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
            in: ['invitedLeader', 'invitedMember'],
          },
        },
      },
    },
  };

  const queryOptions: Prisma.groupsFindManyArgs = {
    take: limit,
    where: userFilter,

    select: {
      uuid: true,
      name: true,
      current_size: true,
      created_at: true,

      group_profiles: {
        where: {
          roles: { type: 'leader' },
        },
        select: {
          users: {
            select: {
              username: true,
              email: true,
            },
          },
          roles: {
            select: {
              type: true,
            },
          },
        },
      },
    },
    orderBy: [{ created_at: 'desc' }, { uuid: 'desc' }],
  };

  // if the frontend sent a cursor we put it into the query
  if (cursor) {
    queryOptions.cursor = {
      uuid: cursor,
    };

    // we skip the cursor, it was already part of the previous list
    queryOptions.skip = 1;
  }

  const groupList = await prisma.groups.findMany(queryOptions);

  // next cursor could be either null, if there isn't any data left in the database
  // or the last elements uuid
  let nextCursor = null;

  if (groupList.length === limit) {
    nextCursor = groupList[groupList.length - 1].uuid;
  }

  return {
    items: groupList,
    meta: {
      next_cursor: nextCursor,
      // has_next_page will be false if the database doesn't contain any more data to be sent
      has_next_page: nextCursor !== null,
      limit: limit,
      // number of sent data
      count: groupList.length,
    },
  };
};

export const joinGroupInfos = async (
  groupUuid: string,
  userUuid: string,
): Promise<GroupProfilesInfos[]> => {
  const group = await getGroupOrThrow(groupUuid);

  const user = await getUserOrThrow(userUuid);

  const alreadyInTheGroup = await prisma.group_profiles.findUnique({
    where: {
      user_id_group_id: {
        user_id: user.user_id,
        group_id: group.group_id,
      },
      roles: {
        type: {
          notIn: ['invitedMember', 'invitedLeader'],
        },
      },
    },
  });

  if (alreadyInTheGroup) {
    throw new Error('USER_ALREADY_JOINED_THE_GROUP');
  }

  const groupInfos = await prisma.group_profiles.findMany({
    where: {
      group_id: group.group_id,

      roles: {
        type: {
          in: ['member', 'leader'],
        },
      },
    },
    select: {
      users: {
        select: {
          email: true,
          username: true,
        },
      },
      roles: {
        select: {
          type: true,
        },
      },
    },
  });

  return groupInfos;
};

export const listAllInfosOfOneGroup = async (
  userUuid: string,
  groupUuid: string,
): Promise<InfosOfTheGroupTheUserIsPartOf> => {
  const user = await getUserOrThrow(userUuid);

  const group = await getGroupOrThrow(groupUuid);

  await userPartOfTheGroupOrThrow(user, group);

  const groupInfos = await prisma.groups.findUnique({
    where: {
      group_id: group.group_id,
    },
    select: {
      name: true,
      current_size: true,
      created_at: true,

      group_profiles: {
        where: {
          roles: {
            type: {
              in: ['member', 'leader'],
            },
          },
        },
        select: {
          users: {
            select: {
              email: true,
              username: true,
            },
          },

          roles: {
            select: {
              type: true,
            },
          },

          nickname: true,
          description: true,
        },
      },
    },
  });

  if (!groupInfos) {
    throw new Error('GROUP_NOT_FOUND');
  }

  return groupInfos;
};

export const deleteGroup = async (userUuid: string, groupUuid: string): Promise<void> => {
  const user = await getUserOrThrow(userUuid);

  const group = await getGroupOrThrow(groupUuid);

  await leaderOfTheGroupOrThrow(user, group);

  await prisma.groups.delete({
    where: {
      group_id: group.group_id,
    },
  });
};

export const updateGroup = async (
  userUuid: string,
  groupUuid: string,
  updateData: { name?: string },
): Promise<groups> => {
  const user = await getUserOrThrow(userUuid);

  const group = await getGroupOrThrow(groupUuid);

  await leaderOfTheGroupOrThrow(user, group);

  const updatedGroup = await prisma.groups.update({
    where: {
      group_id: group.group_id,
    },
    data: {
      name: updateData.name,
    },
  });

  return updatedGroup;
};

export const removeUserFromGroupByEmail = async (
  userUuid: string,
  groupUuid: string,
  userToRemoveEmail: string,
): Promise<void> => {
  const user = await getUserOrThrow(userUuid);

  const group = await getGroupOrThrow(groupUuid);

  const userToRemove = await getUserByEmailOrThrow(userToRemoveEmail);

  await leaderOfTheGroupOrThrow(user, group);

  const targetUserProfile = await getUserGroupProfile(userToRemove, group);

  if (targetUserProfile.roles.type === 'leader') {
    throw new Error('LEADERS_CAN_NOT_BE_REMOVED');
  }

  await prisma.group_profiles.delete({
    where: {
      user_id_group_id: {
        user_id: userToRemove.user_id,
        group_id: group.group_id,
      },
    },
  });
};

export const userLeavingGroup = async (userUuid: string, groupUuid: string): Promise<void> => {
  const user = await getUserOrThrow(userUuid);

  const group = await getGroupOrThrow(groupUuid);

  const userProfile = await getUserGroupProfile(user, group);

  // number of current users in the group
  const currentGroupSize = await prisma.group_profiles.count({
    where: {
      group_id: group.group_id,
    },
  });

  // if there is only one user left in the group
  // we delete the group too
  if (currentGroupSize === 1) {
    await prisma.groups.delete({
      where: {
        group_id: group.group_id,
      },
    });

    return;
  }

  // there are other users in the group too, but the user that wants to leave is a leader
  if (userProfile.roles.type === 'leader') {
    // how many leaders are in the group
    const numberOfLeaders = await prisma.group_profiles.count({
      where: {
        group_id: group.group_id,
        roles: {
          type: 'leader',
        },
      },
    });

    // if the user is the only leader of the group
    // he can leave only if he promotes someone else to leader role before
    if (numberOfLeaders === 1) {
      throw new Error('CANNOT_LEAVE_AS_ONLY_LEADER');
    }
  }

  // user isn't leader or there are other leaders too
  // we are using transaction, so the deletion of the profile
  // and the decrementation of the group size will happen at once
  await prisma.$transaction([
    // deleting the user
    prisma.group_profiles.delete({
      where: {
        user_id_group_id: {
          user_id: user.user_id,
          group_id: group.group_id,
        },
      },
    }),

    // decrementing group size
    prisma.groups.update({
      where: {
        group_id: group.group_id,
      },
      data: {
        current_size: {
          decrement: 1,
        },
      },
    }),
  ]);
};
