import { Request, Response } from 'express';
import * as groupsService from './groups.service';
import { listGroupsSchema } from './groups.validation';
import { z } from 'zod';

type ListGroupsQuery = z.infer<typeof listGroupsSchema>;

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
        res.status(403).json({
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
        res.status(404).json({
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

    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue listing the groups the user has pending invites to!',
    });
  }
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

      if (errorMessage === 'USER_NOT_FOUND') {
        res.status(403).json({
          status: 'error',
          message: 'You must have a registered user to join a group!',
        });

        return;
      }

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

export const listAllInfosOfOneGroup = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = error.message;

      if (errorMessage === 'USER_NOT_PART_OF_THE_GROUP') {
        res.status(403).json({
          status: 'error',
          message: 'User must be part of the group to list all of the information about it!',
        });

        return;
      }

      if (errorMessage === 'GROUP_NOT_FOUND') {
        res.status(404).json({
          status: 'error',
          message: 'This group does not exist!',
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

export const deleteGroup = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = error.message;

      if (errorMessage === 'USER_NOT_FOUND') {
        res.status(403).json({
          status: 'error',
          message: 'You must have a registered user to delete a group!',
        });

        return;
      }

      if (errorMessage === 'GROUP_NOT_FOUND') {
        res.status(404).json({
          status: 'error',
          message: 'This group does not exist!',
        });

        return;
      }

      if (errorMessage === 'USER_IS_NOT_LEADER_IN_GROUP') {
        res.status(403).json({
          status: 'error',
          message: 'User must have leader role to delete a group!',
        });

        return;
      }
    }

    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue during the deletion of the group!',
    });
  }
};

export const updateGroup = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = error.message;

      if (errorMessage === 'USER_NOT_FOUND') {
        res.status(403).json({
          status: 'error',
          message: 'You must have a registered user to update a group!',
        });

        return;
      }

      if (errorMessage === 'GROUP_NOT_FOUND') {
        res.status(404).json({
          status: 'error',
          message: 'This group does not exist!',
        });

        return;
      }

      if (errorMessage === 'USER_IS_NOT_LEADER_IN_GROUP') {
        res.status(403).json({
          status: 'error',
          message: 'User must have leader role to update a group!',
        });

        return;
      }
    }
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue while updating the group!',
    });
  }
};

export const removeUserFromGroupByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = error.message;

      if (errorMessage === 'USER_NOT_FOUND') {
        res.status(403).json({
          status: 'error',
          message: 'You must have a registered user to remove a user from a group!',
        });

        return;
      }

      if (errorMessage === 'GROUP_NOT_FOUND') {
        res.status(404).json({
          status: 'error',
          message: 'This group does not exist!',
        });

        return;
      }

      if (errorMessage === 'USER_NOT_FOUND_WITH_PROVIDED_EMAIL') {
        res.status(404).json({
          status: 'error',
          message: 'The user with this email address does not exist!',
        });

        return;
      }

      if (errorMessage === 'USER_IS_NOT_LEADER_IN_GROUP') {
        res.status(401).json({
          status: 'error',
          message: 'User must have a leader role in the group to remove others',
        });

        return;
      }

      if (errorMessage === 'USER_PROFILE_IN_GROUP_NOT_FOUND') {
        res.status(400).json({
          status: 'error',
          message: 'User must be in the group to be able to be removed!',
        });

        return;
      }

      if (errorMessage === 'LEADERS_CAN_NOT_BE_REMOVED') {
        res.status(400).json({
          status: 'error',
          message: 'Leaders of the group can not be removed!',
        });

        return;
      }
    }

    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue while removing user from the group!',
    });
  }
};

export const userLeavingGroup = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = error.message;

      if (errorMessage === 'USER_NOT_FOUND') {
        res.status(403).json({
          status: 'error',
          message: 'You must have a registered user to leave from a group!',
        });

        return;
      }

      if (errorMessage === 'GROUP_NOT_FOUND') {
        res.status(404).json({
          status: 'error',
          message: 'This group does not exist!',
        });

        return;
      }

      if (errorMessage === 'USER_PROFILE_IN_GROUP_NOT_FOUND') {
        res.status(400).json({
          status: 'error',
          message: 'User must be in the group to be able to leave!',
        });

        return;
      }

      if (errorMessage === 'CANNOT_LEAVE_AS_ONLY_LEADER') {
        res.status(400).json({
          status: 'error',
          message: 'User can not leave if there are no other leaders in the group!',
        });

        return;
      }
    }

    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Error! There was an issue while leaving from the group!',
    });
  }
};
