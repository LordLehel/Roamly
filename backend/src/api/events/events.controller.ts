import { Request, Response } from 'express';
import { BaseController } from '../../utils/BaseController';
import * as eventService from './events.service';

class EventsController extends BaseController {
  public createEvent = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const groupUuid = req.params.groupUuid as string;

    const data = req.body;

    const newEvent = await eventService.createEvent(user.uuid, groupUuid, data);

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully!',
      data: newEvent,
    });
  });

  public updateEvent = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const groupUuid = req.params.groupUuid as string;

    const eventUuid = req.params.eventUuid as string;

    const data = req.body;

    const updatedEvent = await eventService.updateEvent(user.uuid, groupUuid, eventUuid, data);

    res.status(200).json({
      status: 'success',
      message: 'Event updated successfully!',
      data: updatedEvent,
    });
  });

  public addNewParticipants = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const groupUuid = req.params.groupUuid as string;

      const eventUuid = req.params.eventUuid as string;

      const { participant_emails } = req.body;

      const updatedParticipantList = await eventService.addNewParticipants(
        user.uuid,
        groupUuid,
        eventUuid,
        participant_emails,
      );

      res.status(200).json({
        status: 'success',
        message: 'New participants added successfully!',
        data: updatedParticipantList,
      });
    },
  );

  public deleteEvent = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const groupUuid = req.params.groupUuid as string;

    const eventUuid = req.params.eventUuid as string;

    await eventService.deleteEvent(user.uuid, groupUuid, eventUuid);

    res.status(200).json({
      status: 'success',
      message: 'Event successfully deleted!',
    });
  });

  public removeParticipantFromEvent = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const groupUuid = req.params.groupUuid as string;

      const eventUuid = req.params.eventUuid as string;

      const targetUuid = req.params.targetUuid as string;

      await eventService.removeParticipantFromEvent(user.uuid, groupUuid, eventUuid, targetUuid);

      res.status(200).json({
        status: 'success',
        message: 'Participant removed successfully!',
      });
    },
  );

  public listEvents = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const groupUuid = req.params.groupUuid as string;

    const { start_date, end_date, title, limit, cursor } = req.query as {
      start_date?: string;
      end_date?: string;
      title?: string;
      limit?: number;
      cursor?: string;
    };
    const filters = { start_date, end_date, title, limit, cursor };

    const eventList = await eventService.listEvents(user.uuid, groupUuid, filters);

    res.status(200).json({
      status: 'success',
      message: 'Events listed successfully!',
      data: eventList,
    });
  });

  public listEventStartDates = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const groupUuid = req.params.groupUuid as string;

      const dateList = await eventService.listEventStartDates(user.uuid, groupUuid);

      res.status(200).json({
        status: 'success',
        message: 'List containing the dates of all events in the group retrieved successfully!',
        data: dateList,
      });
    },
  );
}
export default new EventsController();
