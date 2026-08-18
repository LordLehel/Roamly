import { Request, Response } from 'express';
import * as groupsService from './groups.service';
import { listGroupsSchema } from './groups.validation';
import { z } from 'zod';
import { BaseController } from '../../utils/BaseController';

type ListGroupsQuery = z.infer<typeof listGroupsSchema>;

class GroupsController extends BaseController {
  public createGroup = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { groupName, initialInvites } = req.body;
    const user = res.locals.user!;

    const newGroup = await groupsService.createGroup(user.uuid, groupName, initialInvites);

    res.status(201).json({
      status: 'success',
      message: `Group successfully created with name: ${newGroup.name}`,
      data: newGroup,
    });
  });

  public listAllGroupsTheUserIsPartOf = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const { limit, cursor } = req.query as unknown as ListGroupsQuery;

      const groupList = await groupsService.listAllGroupsTheUserIsPartOf(user.uuid, limit, cursor);

      res.status(200).json({
        status: 'success',
        message: 'The list of all groups available:',
        data: groupList,
      });
    },
  );

  public joinAGroupByUuidIfUserIsInvited = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

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
    },
  );

  public inviteUsersToYourGroup = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

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
    },
  );

  public pendingInvites = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const { limit, cursor } = req.query as unknown as ListGroupsQuery;

    const pendingInviteGroups = await groupsService.pendingInvites(user.uuid, limit, cursor);

    res.status(200).json({
      status: 'success',
      message: 'The list of all groups the user has pending invites to:',
      data: pendingInviteGroups,
    });
  });

  public joinGroupInfos = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { groupUuid } = req.params;

    const user = res.locals.user!;

    const infosOfTheGroup = await groupsService.joinGroupInfos(groupUuid as string, user.uuid);

    res.status(200).json({
      status: 'success',
      message: 'Information about the group the user wants to join:',
      data: infosOfTheGroup,
    });
  });

  public listAllInfosOfOneGroup = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const { groupUuid } = req.params;

      const groupInfos = await groupsService.listAllInfosOfOneGroup(user.uuid, groupUuid as string);

      res.status(200).json({
        status: 'success',
        message: 'All information about the group:',
        data: groupInfos,
      });
    },
  );

  public deleteGroup = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const { groupUuid } = req.params;

    await groupsService.deleteGroup(user.uuid, groupUuid as string);

    res.status(200).json({
      status: 'success',
      message: 'Group deleted successfully!',
    });
  });

  public updateGroup = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;
    const { groupUuid } = req.params;

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
  });

  public removeUserFromGroupByEmail = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const { groupUuid, email: userToRemoveEmail } = req.params;

      await groupsService.removeUserFromGroupByEmail(
        user.uuid,
        groupUuid as string,
        userToRemoveEmail as string,
      );

      res.status(200).json({
        status: 'success',
        message: 'User successfully removed from group!',
      });
    },
  );

  public userLeavingGroup = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const { groupUuid } = req.params;

    await groupsService.userLeavingGroup(user.uuid, groupUuid as string);

    res.status(200).json({
      status: 'success',
      message: 'User successfully left from group!',
    });
  });
}

export default new GroupsController();
