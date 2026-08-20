import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import filesController from './files.controller';
import { uploadDocument } from '../../middlewares/upload.middleware';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './files.validation';

const router = Router();

router.use(requireAuth);

router.post(
  '/document',
  uploadDocument.single('file'),
  validateData(zodSchemas.uploadPrivateDocumentSchema, 'body'),
  filesController.uploadPrivateDocument,
);
router.get(
  '/document/:fileId',
  validateData(zodSchemas.fileIdValidationSchema, 'params'),
  filesController.getPrivateDocumentUrl,
);
router.delete(
  '/document/:fileId',
  validateData(zodSchemas.fileIdValidationSchema, 'params'),
  filesController.deletePrivateDocument,
);
router.get('/documents', filesController.getAllPrivateDocumentsMetadataOfAUser);

export default router;
