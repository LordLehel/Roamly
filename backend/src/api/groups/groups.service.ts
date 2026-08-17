import prisma from '../../prisma';
import { groups, Prisma } from '@prisma/client';
import {
  profileRelatedToTheGroup,
  PaginatedGroups,
  GroupProfilesInfos,
  InfosOfTheGroupTheUserIsPartOf,
} from '../../types/group.types';
import { ROLES } from '../../constants/roles.constants';

export const createGroup = async (
  creatorUuid: string,
  name: string,
  initialInvites?: { email: string; role: string }[],
): Promise<groups> => {
  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: creatorUuid },
  });

  const leaderRole = await prisma.roles.findFirstOrThrow({
    where: { type: ROLES.LEADER },
  });

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
  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: userUuid },
  });

  const userFilter = {
    group_profiles: {
      some: {
        users: {
          uuid: user.uuid,
        },

        roles: {
          type: {
            in: [ROLES.LEADER, ROLES.MEMBER],
          },
        },
      },
    },
  };

  // cursor logic manually (can't make it with uuid using prisma without uuid being unique)
  let cursorFilter: Prisma.groupsWhereInput = {};

  // data of the element the cursor is pointing at
  if (cursor) {
    const cursorItem = await prisma.groups.findFirst({
      where: {
        uuid: cursor,
      },
      select: {
        created_at: true,
        uuid: true,
      },
    });

    // items older than the cursor item
    if (cursorItem) {
      cursorFilter = {
        OR: [
          {
            created_at: { lt: cursorItem.created_at },
          },
          {
            created_at: cursorItem.created_at,
            uuid: { lt: cursorItem.uuid },
          },
        ],
      };
    }
  }

  const queryOptions: Prisma.groupsFindManyArgs = {
    take: limit,
    where: {
      AND: [userFilter, cursorFilter],
    },

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
  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: userUuid },
  });

  const group = await prisma.groups.findFirstOrThrow({
    where: { uuid: groupUuid },
  });

  const invitedProfil = await prisma.group_profiles.findFirst({
    where: {
      users: { uuid: user.uuid },
      groups: { uuid: group.uuid },
      roles: {
        type: { in: [ROLES.INVITEDLEADER, ROLES.INVITEDMEMBER] },
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

  if (invitedProfil.roles.type === ROLES.INVITEDLEADER) {
    newRoleName = ROLES.LEADER;
  } else if (invitedProfil.roles.type === ROLES.INVITEDMEMBER) {
    newRoleName = ROLES.MEMBER;
  }
  const existingRole = await prisma.roles.findFirstOrThrow({
    where: { type: newRoleName },
  });

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
  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: userUuid },
  });

  const invitedUser = await prisma.users.findUniqueOrThrow({
    where: {
      email: invitedUserEmail,
    },
  });

  const group = await prisma.groups.findFirstOrThrow({
    where: { uuid: groupUuid },
  });

  const role = await prisma.roles.findFirstOrThrow({
    where: { type: inviteWithRole },
  });

  if (![ROLES.INVITEDLEADER as string, ROLES.INVITEDMEMBER as string].includes(inviteWithRole)) {
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

  if (!inviterProfile || inviterProfile.roles.type !== ROLES.LEADER) {
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
  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: userUuid },
  });

  const userFilter = {
    group_profiles: {
      some: {
        users: {
          uuid: user.uuid,
        },

        roles: {
          type: {
            in: [ROLES.INVITEDLEADER, ROLES.INVITEDMEMBER],
          },
        },
      },
    },
  };

  // cursor logic manually (can't make it with uuid using prisma without uuid being unique)
  let cursorFilter: Prisma.groupsWhereInput = {};

  // data of the element the cursor is pointing at
  if (cursor) {
    const cursorItem = await prisma.groups.findFirst({
      where: {
        uuid: cursor,
      },
      select: {
        created_at: true,
        uuid: true,
      },
    });

    // items older than the cursor item
    if (cursorItem) {
      cursorFilter = {
        OR: [
          {
            created_at: { lt: cursorItem.created_at },
          },
          {
            created_at: cursorItem.created_at,
            uuid: { lt: cursorItem.uuid },
          },
        ],
      };
    }
  }

  const queryOptions: Prisma.groupsFindManyArgs = {
    take: limit,
    where: {
      AND: [userFilter, cursorFilter],
    },

    select: {
      uuid: true,
      name: true,
      current_size: true,
      created_at: true,

      group_profiles: {
        where: {
          roles: { type: ROLES.LEADER },
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
  const group = await prisma.groups.findFirstOrThrow({
    where: { uuid: groupUuid },
  });

  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: userUuid },
  });

  const alreadyInTheGroup = await prisma.group_profiles.findUnique({
    where: {
      user_id_group_id: {
        user_id: user.user_id,
        group_id: group.group_id,
      },
      roles: {
        type: {
          notIn: [ROLES.INVITEDMEMBER, ROLES.INVITEDLEADER],
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
          in: [ROLES.MEMBER, ROLES.LEADER],
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
  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: userUuid },
  });

  const group = await prisma.groups.findFirstOrThrow({
    where: { uuid: groupUuid },
  });

  await prisma.group_profiles.findFirstOrThrow({
    where: {
      user_id: user.user_id,
      group_id: group.group_id,
      roles: {
        type: {
          in: [ROLES.MEMBER, ROLES.LEADER],
        },
      },
    },
  });

  const groupInfos = await prisma.groups.findUniqueOrThrow({
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
              in: [ROLES.MEMBER, ROLES.LEADER],
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

  return groupInfos;
};

export const deleteGroup = async (userUuid: string, groupUuid: string): Promise<void> => {
  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: userUuid },
  });

  const group = await prisma.groups.findFirstOrThrow({
    where: { uuid: groupUuid },
  });

  await prisma.group_profiles.findFirstOrThrow({
    where: {
      group_id: group.group_id,
      user_id: user.user_id,

      roles: {
        type: ROLES.LEADER,
      },
    },
  });

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
  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: userUuid },
  });

  const group = await prisma.groups.findFirstOrThrow({
    where: { uuid: groupUuid },
  });

  await prisma.group_profiles.findFirstOrThrow({
    where: {
      group_id: group.group_id,
      user_id: user.user_id,

      roles: {
        type: ROLES.LEADER,
      },
    },
  });

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
  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: userUuid },
  });

  const group = await prisma.groups.findFirstOrThrow({
    where: { uuid: groupUuid },
  });

  const userToRemove = await prisma.users.findUniqueOrThrow({
    where: {
      email: userToRemoveEmail,
    },
  });

  const targetUserProfile = await prisma.group_profiles.findUniqueOrThrow({
    where: {
      user_id_group_id: {
        user_id: userToRemove.user_id,
        group_id: group.group_id,
      },
    },
    select: {
      nickname: true,
      description: true,

      roles: {
        select: {
          type: true,
        },
      },
    },
  });

  await prisma.group_profiles.findFirstOrThrow({
    where: {
      group_id: group.group_id,
      user_id: user.user_id,

      roles: {
        type: ROLES.LEADER,
      },
    },
  });

  if (targetUserProfile.roles.type === ROLES.LEADER) {
    throw new Error('LEADERS_CAN_NOT_BE_REMOVED');
  }

  await prisma.$transaction([
    prisma.group_profiles.delete({
      where: {
        user_id_group_id: {
          user_id: userToRemove.user_id,
          group_id: group.group_id,
        },
      },
    }),
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

export const userLeavingGroup = async (userUuid: string, groupUuid: string): Promise<void> => {
  const user = await prisma.users.findFirstOrThrow({
    where: { uuid: userUuid },
  });

  const group = await prisma.groups.findFirstOrThrow({
    where: { uuid: groupUuid },
  });

  const userProfile = await prisma.group_profiles.findUniqueOrThrow({
    where: {
      user_id_group_id: {
        user_id: user.user_id,
        group_id: group.group_id,
      },
    },
    select: {
      nickname: true,
      description: true,

      roles: {
        select: {
          type: true,
        },
      },
    },
  });

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
  if (userProfile.roles.type === ROLES.LEADER) {
    // how many leaders are in the group
    const numberOfLeaders = await prisma.group_profiles.count({
      where: {
        group_id: group.group_id,
        roles: {
          type: ROLES.LEADER,
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
