import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import filesController from './files.controller';
import { uploadDocument } from '../../middlewares/upload.middleware';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './files.validation';

const router = Router();

router.use(requireAuth);

router.post(
  '/documents',
  uploadDocument.single('file'),
  validateData(zodSchemas.privateDocumentDataSchema, 'body'),
  filesController.uploadPrivateDocument,
);
router.get(
  '/documents/:fileId',
  validateData(zodSchemas.fileIdValidationSchema, 'params'),
  filesController.getPrivateDocumentUrl,
);
router.delete(
  '/documents/:fileId',
  validateData(zodSchemas.fileIdValidationSchema, 'params'),
  filesController.deletePrivateDocument,
);
router.get('/documents', filesController.getAllPrivateDocumentsMetadataOfAUser);
router.patch(
  '/documents/:fileId',
  uploadDocument.single('file'),
  validateData(zodSchemas.fileIdValidationSchema, 'params'),
  validateData(zodSchemas.privateDocumentDataSchema, 'body'),
  filesController.replacePrivateDocument,
);
router.post(
  '/documents/share/:fileId',
  validateData(zodSchemas.fileIdValidationSchema, 'params'),
  validateData(
    zodSchemas.groupUuidValidationSchema.extend(zodSchemas.sharingUpdateSchema.shape),
    'body',
  ),
  filesController.shareDocumentsWithGroup,
);
router.delete(
  '/documents/share/:fileId/:groupUuid',
  validateData(
    zodSchemas.fileIdValidationSchema.extend(zodSchemas.groupUuidValidationSchema.shape),
    'params',
  ),
  filesController.deleteSharing,
);
router.patch(
  '/documents/share/:fileId/:groupUuid',
  validateData(
    zodSchemas.fileIdValidationSchema.extend(zodSchemas.groupUuidValidationSchema.shape),
    'params',
  ),
  validateData(zodSchemas.sharingUpdateSchema, 'body'),
  filesController.updateSharingConditions,
);
router.get(
  '/documents/:fileId/shares',
  validateData(zodSchemas.fileIdValidationSchema, 'params'),
  filesController.listAllGroupsADocumentIsSharedWith,
);

export default router;
