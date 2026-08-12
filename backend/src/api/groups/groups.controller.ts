import { Request, Response } from 'express';
import * as groupsService from './groups.service';

export const createGroup = async (req: Request, res: Response): Promise<void> => {
  try {
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
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = error.message;

      if (errorMessage === 'USER_NOT_FOUND') {
        res.status(403).json({
          status: 'error',
          message: 'You must have a registered user to create a group!',
        });

        return;
      }

      if (errorMessage === 'ROLE_TYPE_NOT_FOUND') {
        res.status(500).json({
          status: 'error',
          message:
            'A role does not exist in db, and it is necessary for groupcreation! Please try again later!',
        });

        return;
      }
    }

    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was a problem with the group creation, please try again!',
    });
  }
};

export const listAllGroupsTheUserIsPartOf = async (req: Request, res: Response): Promise<void> => {
  try {
    // limit must be int, if isn't provided it will be 15 by default
    let limit = parseInt(req.query.limit as string) || 15;

    // if limit isn't a number or positive it's value will be 15 by default
    if (isNaN(limit) || limit < 1) {
      limit = 15;
    }

    // if limit is greater than 50, it's value will be set to 50
    if (limit > 50) {
      limit = 50;
    }

    // cursor must be a string, or it could be undefined if it isn't provided
    const cursor = req.query.cursor as string | undefined;

    // if cursor is provided but isn't a string we send an error message
    if (cursor && typeof cursor !== 'string') {
      res.status(400).json({
        error: 'Invalid cursor foramt!',
      });

      return;
    }

    const user = res.locals.user;

    if (!user?.uuid) {
      res.status(401).json({
        status: 'error',
        message: 'Authorization needed!',
      });

      return;
    }

    const groupList = await groupsService.listAllGroupsTheUserIsPartOf(user.uuid, limit, cursor);

    res.status(202).json({
      status: 'success',
      message: 'The list of all groups available:',
      data: groupList,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = error.message;

      if (errorMessage === 'USER_NOT_FOUND') {
        res.status(403).json({
          status: 'error',
          message: 'You must have a registered user to list groups you are part of!',
        });

        return;
      }
    }

    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue with the listing of groups the user is part of!',
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = error.message;

      if (errorMessage === 'USER_NOT_INVITED_OR_ALREADY_PART_OF_THE_GROUP') {
        res.status(404).json({
          status: 'error',
          message: 'User not invited to or already part of the group!',
        });

        return;
      }

      if (errorMessage === 'USER_NOT_FOUND') {
        res.status(403).json({
          status: 'error',
          message: 'You must have a registered user to join a group!',
        });

        return;
      }

      if (errorMessage === 'GROUP_NOT_FOUND') {
        res.status(403).json({
          status: 'error',
          message: 'The group you are trying to join does not exist!',
        });

        return;
      }
    }

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

    const { invitedUserEmail, inviteWithRole } = req.body;

    if (!invitedUserEmail || !inviteWithRole) {
      res.status(400).json({
        status: 'error',
        message: 'invitedUserEmail and inviteWithRole are required in the request body!',
      });

      return;
    }

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = error.message;

      if (errorMessage === 'GROUP_NOT_FOUND') {
        res.status(403).json({
          status: 'error',
          message: 'The group you are trying to invite others to does not exist!',
        });

        return;
      }

      if (errorMessage === 'ROLE_TYPE_NOT_FOUND') {
        res.status(403).json({
          status: 'error',
          message: 'You must have a valid role to invite others to your group!',
        });

        return;
      }

      if (errorMessage === 'INVALID_INVITATION_ROLE') {
        res.status(400).json({
          status: 'error',
          message: 'You can only invite someone to be invitedLeader or invitedMember!',
        });

        return;
      }

      if (errorMessage === 'NOT_A_LEADER_OF_THE_GROUP') {
        res.status(403).json({
          status: 'error',
          message: 'Only leaders can invite others to a group!',
        });

        return;
      }

      if (errorMessage === 'USER_ALREADY_IN_GROUP_OR_INVITED') {
        res.status(409).json({
          status: 'error',
          message: 'This user is already in the group or has a pending invite!',
        });

        return;
      }
    }

    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue during the invitation of a user!',
    });
  }
};

export const pendingInvites = async (req: Request, res: Response): Promise<void> => {
  try {
    // limit must be int, if isn't provided it will be 15 by default
    let limit = parseInt(req.query.limit as string) || 15;

    // if limit isn't a number or positive it's value will be 15 by default
    if (isNaN(limit) || limit < 1) {
      limit = 15;
    }

    // if limit is greater than 50, it's value will be set to 50
    if (limit > 50) {
      limit = 50;
    }

    // cursor must be a string, or it could be undefined if it isn't provided
    const cursor = req.query.cursor as string | undefined;

    // if cursor is provided but isn't a string we send an error message
    if (cursor && typeof cursor !== 'string') {
      res.status(400).json({
        error: 'Invalid cursor foramt!',
      });

      return;
    }

    const user = res.locals.user;

    if (!user?.uuid) {
      res.status(401).json({
        status: 'error',
        message: 'Authorization needed!',
      });

      return;
    }

    const pendingInviteGroups = await groupsService.pendingInvites(user?.uuid, limit, cursor);

    res.status(202).json({
      status: 'success',
      message: 'The list of all groups the user has pending invites to:',
      data: pendingInviteGroups,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = error.message;

      if (errorMessage === 'USER_NOT_FOUND') {
        res.status(403).json({
          status: 'error',
          message: 'You must have a registered user to list groups you are part of!',
        });

        return;
      }
    }
  }

  res.status(500).json({
    status: 'error',
    message: 'Error! There was an issue listing the groups the user has pending invites to!',
  });
};

export const joinGroupInfos = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = error.message;

      if (errorMessage === 'USER_ALREADY_JOINED_THE_GROUP') {
        res.status(409).json({
          status: 'error',
          message: 'This user is already in the group!',
        });

        return;
      }
    }
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue during the listing of the information about the group!',
    });
  }
};
