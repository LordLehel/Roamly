import { Router } from 'express';
import eventsController from './events.controller';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './events.validation';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.post(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidParamSchema, 'params'),
  validateData(zodSchemas.createEventSchema, 'body'),
  eventsController.createEvent,
);

router.patch(
  '/:groupUuid/:eventUuid',
  validateData(zodSchemas.groupEventUuidParamSchema, 'params'),
  validateData(zodSchemas.updateEventSchema, 'body'),
  eventsController.updateEvent,
);

router.post(
  '/:groupUuid/:eventUuid/participants',
  validateData(zodSchemas.groupEventUuidParamSchema, 'params'),
  validateData(zodSchemas.addNewParticipantsBodySchema, 'body'),
  eventsController.addNewParticipants,
);

router.delete(
  '/:groupUuid/:eventUuid',
  validateData(zodSchemas.groupEventUuidParamSchema, 'params'),
  eventsController.deleteEvent,
);

router.delete(
  '/:groupUuid/:eventUuid/participants/:targetUuid',
  validateData(
    zodSchemas.groupEventUuidParamSchema.extend(zodSchemas.participantUuidParamSchema.shape),
    'params',
  ),
  eventsController.removeParticipantFromEvent,
);

router.get(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidParamSchema, 'params'),
  validateData(zodSchemas.groupListingFilterQuerySchema, 'query'),
  eventsController.listEvents,
);

router.get(
  '/:groupUuid/dates',
  validateData(zodSchemas.groupUuidParamSchema, 'params'),
  eventsController.listEventStartDates,
);

export default router;
