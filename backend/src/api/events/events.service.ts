import { events } from "@prisma/client";

export const createEvent = async (userUuid: string, groupUuid: string, data: {title: string; description: string; start_time: string; end_time: string; visibility: string; participant_emails?: string[];}): Promise<events> => {

}