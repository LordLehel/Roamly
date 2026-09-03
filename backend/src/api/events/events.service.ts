import prisma from '../../prisma';
import { event_participants, events, users } from '@prisma/client';
import { BadRequestError, ForbiddenError } from '../../utils/ServerError';
import { EVENT_VISIBILITY } from '../../constants/events.constants';
import { ROLES } from '../../constants/roles.constants';

export const createEvent = async (
  userUuid: string,
  groupUuid: string,
  data: {
    title: string;
    description?: string;
    start_time: string;
    end_time?: string;
    visibility: string;
    participant_emails?: string[];
  },
): Promise<events> => {
  const userGroupInfo = await prisma.group_profiles.findFirst({
    where: {
      users: {
        uuid: userUuid,
      },
      groups: {
        uuid: groupUuid,
      },
    },
    include: {
      users: true,
      groups: true,
      roles: true,
    },
  });

  if (!userGroupInfo) {
    throw new ForbiddenError(
      'User either is not part of the group, or the group or the user does not exist!',
    );
  }

  // if the event is supposed to be private and there are given participant emails
  let participantIds: number[] = [];

  if (data.visibility === EVENT_VISIBILITY.PRIVATE) {
    participantIds.push(userGroupInfo.users.user_id);

    if (data.participant_emails && data.participant_emails.length > 0) {
      const participants = await prisma.users.findMany({
        where: {
          email: {
            in: data.participant_emails,
          },
          group_profiles: {
            some: {
              group_id: userGroupInfo.groups.group_id,
              roles: {
                type: {
                  in: [ROLES.LEADER, ROLES.MEMBER],
                },
              },
            },
          },
        },
      });

      if (participants.length !== data.participant_emails.length) {
        throw new BadRequestError(
          'One or more invited users are not part of this group, or do not exist!',
        );
      }

      const additionalIds = participants.map((p: users) => p.user_id);

      participantIds = [...new Set([...participantIds, ...additionalIds])];
    }
  }

  const newEvent = await prisma.events.create({
    data: {
      title: data.title,
      description: data.description,
      start_time: new Date(data.start_time),
      // if end_time is not provided, it will be the start_time by default,
      // this way the user is able to create events that have no predetermined ending time
      end_time: data.end_time ? new Date(data.end_time) : new Date(data.start_time),

      groups: {
        connect: {
          group_id: userGroupInfo.groups.group_id,
        },
      },

      creator: {
        connect: {
          user_id: userGroupInfo.users.user_id,
        },
      },

      visibility: {
        connect: {
          name: data.visibility,
        },
      },

      ...(participantIds.length > 0 && {
        event_participants: {
          create: participantIds.map((id: number) => ({
            user_id: id,
          })),
        },
      }),
    },
    include: {
      visibility: true,
      event_participants: {
        include: {
          users: {
            select: {
              email: true,
              username: true,
              uuid: true,
            },
          },
        },
      },
    },
  });

  return newEvent;
};

export const updateEvent = async (
  userUuid: string,
  groupUuid: string,
  eventUuid: string,
  data: {
    title?: string;
    description?: string;
    start_time?: string;
    end_time?: string | null;
    visibility?: string;
  },
): Promise<events> => {
  const userGroupInfo = await prisma.group_profiles.findFirst({
    where: {
      users: {
        uuid: userUuid,
      },
      groups: {
        uuid: groupUuid,
      },
    },
    include: {
      users: true,
      groups: true,
      roles: true,
    },
  });

  if (!userGroupInfo) {
    throw new ForbiddenError(
      'User either is not part of the group, or the group or the user does not exist!',
    );
  }

  const existingEvent = await prisma.events.findUniqueOrThrow({
    where: {
      uuid: eventUuid,
      groups: {
        uuid: groupUuid,
      },
    },

    include: {
      visibility: true,
    },
  });

  if (
    existingEvent.creator_id !== userGroupInfo.users.user_id &&
    userGroupInfo.roles.type !== ROLES.LEADER
  ) {
    throw new ForbiddenError(
      'Only the creator of the event or the leaders of the group can update the event!',
    );
  }

  // validating the end_time and start_time,
  // so if a user updates only one of them they still can't be in the wrong order
  const effectiveStartTime = data.start_time ? new Date(data.start_time) : existingEvent.start_time;

  let effectiveEndTime: Date;

  if (data.end_time === null) {
    effectiveEndTime = effectiveStartTime;
  } else if (data.end_time !== undefined) {
    effectiveEndTime = new Date(data.end_time);
  } else {
    if (existingEvent.start_time.getTime() === existingEvent.end_time.getTime()) {
      effectiveEndTime = effectiveStartTime;
    } else {
      effectiveEndTime = existingEvent.end_time;
    }
  }

  if (effectiveEndTime < effectiveStartTime) {
    throw new BadRequestError('End time must be after the start time, or the exact same!');
  }

  let participantOperations = undefined;

  if (data.visibility && data.visibility !== existingEvent.visibility.name) {
    if (data.visibility === EVENT_VISIBILITY.PUBLIC) {
      participantOperations = {
        deleteMany: {},
      };
    } else if (data.visibility === EVENT_VISIBILITY.PRIVATE) {
      participantOperations = {
        create: [{ user_id: existingEvent.creator_id }],
      };
    }
  }

  const updatedEvent = await prisma.events.update({
    where: {
      event_id: existingEvent.event_id,
    },
    data: {
      title: data.title,
      description: data.description,
      start_time: effectiveStartTime,
      end_time: effectiveEndTime,
      visibility: data.visibility
        ? {
            connect: { name: data.visibility },
          }
        : undefined,

      event_participants: participantOperations,
    },

    include: {
      visibility: true,
    },
  });

  return updatedEvent;
};

export const addNewParticipants = async (
  userUuid: string,
  groupUuid: string,
  eventUuid: string,
  participant_emails: string[],
): Promise<event_participants[]> => {
  const userGroupInfo = await prisma.group_profiles.findFirst({
    where: {
      users: {
        uuid: userUuid,
      },
      groups: {
        uuid: groupUuid,
      },
    },

    include: {
      users: true,
      groups: true,
      roles: true,
    },
  });

  if (!userGroupInfo) {
    throw new ForbiddenError(
      'User either is not part of the group, or the group or the user does not exist!',
    );
  }

  // can the user update this event
  const existingEvent = await prisma.events.findUniqueOrThrow({
    where: {
      uuid: eventUuid,
      groups: {
        uuid: groupUuid,
      },
    },
    include: {
      visibility: true,
    },
  });

  if (existingEvent.visibility.name === EVENT_VISIBILITY.PUBLIC) {
    throw new BadRequestError('You can not add participants to public events!');
  }

  if (
    existingEvent.creator_id !== userGroupInfo.users.user_id &&
    userGroupInfo.roles.type !== ROLES.LEADER
  ) {
    throw new ForbiddenError(
      'Only the creator of the event or the leaders of the group can add participants to the event!',
    );
  }

  const participants = await prisma.users.findMany({
    where: {
      email: {
        in: participant_emails,
      },
      group_profiles: {
        some: {
          group_id: userGroupInfo.groups.group_id,
          roles: {
            type: {
              in: [ROLES.LEADER, ROLES.MEMBER],
            },
          },
        },
      },
    },
  });

  if (participants.length !== participant_emails.length) {
    throw new BadRequestError('One or more invited users are not part of this group!');
  }

  const updatedParticipantList = await prisma.event_participants.createManyAndReturn({
    data: participants.map((p: users) => ({
      event_id: existingEvent.event_id,
      user_id: p.user_id,
    })),

    skipDuplicates: true,

    include: {
      users: {
        select: {
          uuid: true,
          email: true,
          username: true,
        },
      },
    },
  });

  return updatedParticipantList as unknown as event_participants[];
};

export const deleteEvent = async (
  userUuid: string,
  groupUuid: string,
  eventUuid: string,
): Promise<void> => {
  const userGroupInfo = await prisma.group_profiles.findFirst({
    where: {
      users: {
        uuid: userUuid,
      },
      groups: {
        uuid: groupUuid,
      },
    },

    include: {
      users: true,
      groups: true,
      roles: true,
    },
  });

  if (!userGroupInfo) {
    throw new ForbiddenError(
      'User either is not part of the group, or the group or the user does not exist',
    );
  }

  const existingEvent = await prisma.events.findUniqueOrThrow({
    where: {
      uuid: eventUuid,
      groups: {
        uuid: groupUuid,
      },
    },
  });

  if (
    userGroupInfo.users.user_id !== existingEvent.creator_id &&
    userGroupInfo.roles.type !== ROLES.LEADER
  ) {
    throw new ForbiddenError(
      'Only the creator of the event or the leaders of the group can delete the event!',
    );
  }

  await prisma.events.delete({
    where: {
      event_id: existingEvent.event_id,
    },
  });
};

export const removeParticipantFromEvent = async (
  userUuid: string,
  groupUuid: string,
  eventUuid: string,
  targetParticipantUuid: string,
): Promise<void> => {
  const userGroupInfo = await prisma.group_profiles.findFirst({
    where: {
      users: {
        uuid: userUuid,
      },
      groups: {
        uuid: groupUuid,
      },
    },

    include: {
      users: true,
      groups: true,
      roles: true,
    },
  });

  if (!userGroupInfo) {
    throw new ForbiddenError(
      'User either is not part of the group, or the group or the user does not exist',
    );
  }

  const existingEvent = await prisma.events.findUniqueOrThrow({
    where: {
      uuid: eventUuid,
      groups: {
        uuid: groupUuid,
      },
    },
  });

  // participants can be removed by group leaders,
  // event creators and by themselves
  if (
    userGroupInfo.roles.type !== ROLES.LEADER &&
    userGroupInfo.users.user_id !== existingEvent.creator_id &&
    userGroupInfo.users.uuid !== targetParticipantUuid
  ) {
    throw new ForbiddenError(
      'Only the creator of the event, the leaders of the group or the same participant can remove a participant!',
    );
  }

  const targetUser = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: targetParticipantUuid,
    },
  });

  await prisma.event_participants.delete({
    where: {
      event_id_user_id: {
        user_id: targetUser.user_id,
        event_id: existingEvent.event_id,
      },
    },
  });
};

export const listEvents = async (
  userUuid: string,
  groupUuid: string,
  filters: {
    start_date?: string;
    end_date?: string;
    title?: string;
    limit?: number;
    cursor?: string;
  },
): Promise<events[]> => {
  const userGroupInfo = await prisma.group_profiles.findFirst({
    where: {
      users: {
        uuid: userUuid,
      },
      groups: {
        uuid: groupUuid,
      },
    },

    include: {
      users: true,
      groups: true,
      roles: true,
    },
  });

  if (!userGroupInfo) {
    throw new ForbiddenError(
      'User either is not part of the group, or the group or the user does not exist!',
    );
  }

  if (userGroupInfo.roles.type !== ROLES.LEADER && userGroupInfo.roles.type !== ROLES.MEMBER) {
    throw new ForbiddenError('User must be part of the group to list events in it!');
  }

  const isLeader = userGroupInfo.roles.type === ROLES.LEADER;

  // if the start and end is the same date, the filter will not work because
  // we would filter from 00:00 to 00:00, so we change the end dates hour to midnight
  let startDateObj = filters.start_date ? new Date(filters.start_date) : undefined;

  let endDateObj = filters.end_date ? new Date(filters.end_date) : undefined;

  if (filters.start_date && !filters.end_date) {
    startDateObj = new Date(filters.start_date);
    startDateObj.setUTCHours(0, 0, 0, 0);

    endDateObj = new Date(filters.start_date);
    endDateObj.setUTCHours(23, 59, 59, 999);
  } else {
    if (startDateObj) {
      startDateObj.setUTCHours(0, 0, 0, 0);
    }
    if (endDateObj) {
      endDateObj.setUTCHours(23, 59, 59, 999);
    }
  }

  const eventList = await prisma.events.findMany({
    take: filters.limit,
    skip: filters.cursor ? 1 : 0,
    cursor: filters.cursor ? { uuid: filters.cursor } : undefined,

    where: {
      group_id: userGroupInfo.groups.group_id,

      title: filters.title
        ? {
            contains: filters.title,
            mode: 'insensitive',
          }
        : undefined,

      end_time: startDateObj
        ? {
            gte: startDateObj,
          }
        : undefined,

      start_time: endDateObj
        ? {
            lte: endDateObj,
          }
        : undefined,

      OR: isLeader
        ? undefined
        : [
            {
              event_participants: {
                some: {
                  user_id: userGroupInfo.users.user_id,
                },
              },
            },
            {
              creator_id: userGroupInfo.users.user_id,
            },
          ],
    },

    orderBy: [{ start_time: 'asc' }, { event_id: 'asc' }],

    include: {
      event_participants: {
        include: {
          users: {
            select: {
              uuid: true,
              username: true,
              email: true,
            },
          },
        },
      },
      creator: {
        select: {
          uuid: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return eventList;
};

export const listEventStartDates = async (
  userUuid: string,
  groupUuid: string,
): Promise<string[]> => {
  const userGroupInfo = await prisma.group_profiles.findFirst({
    where: {
      users: {
        uuid: userUuid,
      },
      groups: {
        uuid: groupUuid,
      },
    },

    include: {
      users: true,
      groups: true,
      roles: true,
    },
  });

  if (!userGroupInfo) {
    throw new ForbiddenError(
      'User either is not part of the group, or the group or the user does not exist!',
    );
  }

  if (userGroupInfo.roles.type !== ROLES.LEADER && userGroupInfo.roles.type !== ROLES.MEMBER) {
    throw new ForbiddenError('User must be part of the group to list event dates in it!');
  }

  const isLeader = userGroupInfo.roles.type === ROLES.LEADER;

  const datesList = await prisma.events.findMany({
    where: {
      group_id: userGroupInfo.groups.group_id,

      OR: isLeader
        ? undefined
        : [
            {
              event_participants: {
                some: {
                  user_id: userGroupInfo.users.user_id,
                },
              },
            },
            {
              creator_id: userGroupInfo.users.user_id,
            },
          ],
    },

    orderBy: { start_time: 'asc' },

    select: {
      start_time: true,
    },
  });

  const uniqueDates = [
    ...new Set(
      datesList.map((event: { start_time: Date }) => event.start_time.toISOString().split('T')[0]),
    ),
  ];

  return uniqueDates;
};
