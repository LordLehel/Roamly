import { Request, Response } from 'express';
import * as groupsService from './groups.service';
import { listGroupsSchema } from './groups.validation';
import { z } from 'zod';

type ListGroupsQuery = z.infer<typeof listGroupsSchema>;

export const createGroup = async (req: Request, res: Response): Promise<void> => {
  const { groupName, initialInvites } = req.body;

  const user = res.locals.user;

  if (!user?.uuid) {
    res.status(401).json({ status: 'error', message: 'Authorization needed!' });
    return;
  }

  const newGroup = await groupsService.createGroup(user.uuid, groupName, initialInvites);

  res.status(201).json({
    status: 'success',
    message: `Group successfully created with name: ${newGroup.name}`,
    data: newGroup,
  });
};

export const listAllGroupsTheUserIsPartOf = async (req: Request, res: Response): Promise<void> => {
  const user = res.locals.user;

  if (!user?.uuid) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization needed!',
    });

    return;
  }

  const { limit, cursor } = req.query as unknown as ListGroupsQuery;

  const groupList = await groupsService.listAllGroupsTheUserIsPartOf(user.uuid, limit, cursor);

  res.status(200).json({
    status: 'success',
    message: 'The list of all groups available:',
    data: groupList,
  });
};

export const joinAGroupByUuidIfUserIsInvited = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user = res.locals.user;

  if (!user?.uuid) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization needed!',
    });

    return;
  }

  const { groupUuid } = req.params;

  const updatedProfile = await groupsService.joinAGroupByUuidIfUserIsInvited(
    user.uuid,
    groupUuid as string,
  );

  res.status(200).json({
    status: 'success',
    message: 'Successfully joined the group!',
    data: updatedProfile,
  });
};

export const inviteUsersToYourGroup = async (req: Request, res: Response): Promise<void> => {
  const user = res.locals.user;

  if (!user?.uuid) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization needed!',
    });

    return;
  }

  const { groupUuid } = req.params;

  const { invitedUserEmail, inviteWithRole } = req.body;

  const createdInvite = await groupsService.inviteUsersToYourGroup(
    user.uuid,
    invitedUserEmail,
    groupUuid as string,
    inviteWithRole,
  );

  res.status(201).json({
    status: 'success',
    message: 'User successfully invited!',
    data: createdInvite,
  });
};

export const pendingInvites = async (req: Request, res: Response): Promise<void> => {
  const user = res.locals.user;

  if (!user?.uuid) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization needed!',
    });

    return;
  }

  const { limit, cursor } = req.query as unknown as ListGroupsQuery;

  const pendingInviteGroups = await groupsService.pendingInvites(user.uuid, limit, cursor);

  res.status(200).json({
    status: 'success',
    message: 'The list of all groups the user has pending invites to:',
    data: pendingInviteGroups,
  });
};

export const joinGroupInfos = async (req: Request, res: Response): Promise<void> => {
  const { groupUuid } = req.params;

  const user = res.locals.user;

  if (!user?.uuid) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization needed!',
    });

    return;
  }

  const infosOfTheGroup = await groupsService.joinGroupInfos(groupUuid as string, user.uuid);

  res.status(200).json({
    status: 'success',
    message: 'Information about the group the user wants to join:',
    data: infosOfTheGroup,
  });
};

export const listAllInfosOfOneGroup = async (req: Request, res: Response): Promise<void> => {
  const user = res.locals.user;

  const { groupUuid } = req.params;

  if (!user?.uuid) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization needed!',
    });

    return;
  }

  const groupInfos = await groupsService.listAllInfosOfOneGroup(user.uuid, groupUuid as string);

  res.status(200).json({
    status: 'success',
    message: 'All information about the group:',
    data: groupInfos,
  });
};

export const deleteGroup = async (req: Request, res: Response): Promise<void> => {
  const user = res.locals.user;

  const { groupUuid } = req.params;

  if (!user?.uuid) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization needed!',
    });

    return;
  }

  await groupsService.deleteGroup(user.uuid, groupUuid as string);

  res.status(200).json({
    status: 'success',
    message: 'Group deleted successfully!',
  });
};

export const updateGroup = async (req: Request, res: Response): Promise<void> => {
  const user = res.locals.user;
  const { groupUuid } = req.params;

  if (!user?.uuid) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization needed!',
    });

    return;
  }

  const validatedData = req.body;

  const updatedGroupInfos = await groupsService.updateGroup(
    user.uuid,
    groupUuid as string,
    validatedData,
  );

  res.status(200).json({
    status: 'success',
    message: 'Group updated successfully!',
    data: updatedGroupInfos,
  });
};

export const removeUserFromGroupByEmail = async (req: Request, res: Response): Promise<void> => {
  const user = res.locals.user;

  const { groupUuid, email: userToRemoveEmail } = req.params;

  if (!user?.uuid) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization needed!',
    });

    return;
  }

  await groupsService.removeUserFromGroupByEmail(
    user.uuid,
    groupUuid as string,
    userToRemoveEmail as string,
  );

  res.status(200).json({
    status: 'success',
    message: 'User successfully removed from group!',
  });
};

export const userLeavingGroup = async (req: Request, res: Response): Promise<void> => {
  const user = res.locals.user;

  const { groupUuid } = req.params;

  if (!user?.uuid) {
    res.status(401).json({
      status: 'error',
      message: 'Authorization needed!',
    });

    return;
  }

  await groupsService.userLeavingGroup(user.uuid, groupUuid as string);

  res.status(200).json({
    status: 'success',
    message: 'User successfully left from group!',
  });
};
