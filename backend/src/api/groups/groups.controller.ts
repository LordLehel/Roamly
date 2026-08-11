import { Request, Response } from 'express';
import * as groupsService from './groups.service';

export const createGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;

    const user = res.locals.user;

    if (!user?.uuid) {
      res.status(401).json({ status: 'error', message: 'Authorization needed!' });
      return;
    }

    const newGroup = await groupsService.createGroup(user.uuid, body.name);

    res.status(201).json({
      status: 'success',
      message: `Group successfully created with name: ${newGroup.name}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was a problem with the group creation, please try again!',
    });
  }
};

export const listAllGroupsTheUserIsPartOf = async (req: Request, res: Response): Promise<void> => {
  try {
    // which page is the user asking for
    // (this will give 1 if the parameter is 0 bcs js handles 0 as false in an or statement)
    const page = parseInt(req.query.page as string) || 1;

    // how many groups is the user asking for on the page
    // (this will give 5 if the parameter is 0 bcs js handles 0 as false in an or statement)
    const requestedLimit = parseInt(req.query.limit as string) || 5;

    // the user can't request more than 10 groups on one page
    const limit = Math.min(requestedLimit, 10);

    if (limit < 1 || page < 1) {
      res.status(403).json({
        status: 'error',
        message: 'Invalid page or limit parameter in the request!',
      });
    }

    const user = res.locals.user;

    if (!user?.uuid) {
      res.status(401).json({
        status: 'error',
        message: 'Authorization needed!',
      });

      return;
    }

    const groupList = await groupsService.listAllGroupsTheUserIsPartOf(user.uuid, page, limit);

    res.status(202).json({
      status: 'success',
      message: 'The list of all groups available:',
      data: groupList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue with the listing of available groups!',
    });
  }
};

export const joinAGroupByUuidIfUserIsInvited = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an error with the server during the joining process!',
    });
  }
};

export const inviteUsersToYourGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = res.locals.user;

    if (!user?.uuid) {
      res.status(401).json({
        status: 'error',
        message: 'Authorization needed!',
      });

      return;
    }

    const { groupUuid } = req.params;

    const { invitedUserUuid, inviteWithRole } = req.body;

    if (!invitedUserUuid || !inviteWithRole) {
      res.status(400).json({
        status: 'error',
        message: 'invitedUserUuid and inviteWithRole are required in the request body!',
      });

      return;
    }

    const createdInvite = await groupsService.inviteUsersToYourGroup(
      user.uuid,
      invitedUserUuid,
      groupUuid as string,
      inviteWithRole,
    );

    res.status(201).json({
      status: 'success',
      message: 'User successfully invited!',
      data: createdInvite,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue during the invitation of a user!',
    });
  }
};
