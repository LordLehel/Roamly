import prisma from '../../prisma';
import { groups } from "@prisma/client";

export const createGroup = async ( creatorUuid: string, name: string ): Promise<groups> => {
    const user = await prisma.users.findUnique({
        where: { uuid: creatorUuid }
    });

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }

    const leaderRole = await prisma.roles.findFirst({
        where: { type: 'leader' }
    });

    if (!leaderRole) {
        throw new Error("ROLE_NOT_FOUND");
    }

    const newGroup = prisma.groups.create({
        data: {
            name,
            current_size: 1,
            group_profiles: {
                create: {
                    user_id: user.user_id,
                    role_id: leaderRole.role_id,
                }
            }
        },
        include: {
            group_profiles: {
                include: {
                    roles: true,
                }
            }
        }
    });

    return newGroup;
};

export const listAllGroups = async (): Promise<groups[]> => {
    return prisma.groups.findMany();
}