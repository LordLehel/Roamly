import { Request, Response } from "express";
import * as groupsService from './groups.service';

export const createGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body;

        if (!req.user?.uuid) {
            res.status(401).json({ message: 'Authorization needed!' });
            return;
        }

        const newGroup = await groupsService.createGroup(req.user.uuid, body.name);

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

export const listAllGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const groupList = await groupsService.listAllGroups();

        // needs fixing, groupList returns objects
        res.status(202).json({
            status: 'success',
            message: `The list of all groups available:\n ${groupList}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error! There was an issue with the listing of available groups!',
        });
    }
}