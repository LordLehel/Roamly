import { Request, Response } from "express";
import * as groupsService from './groups.service';
import { JwtPayload } from "jsonwebtoken";

export const createGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const name = req.body;

        const creatorUser = res.locals.user as JwtPayload;

        const newGroup = await groupsService.createGroup(creatorUser.uuid, name);

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