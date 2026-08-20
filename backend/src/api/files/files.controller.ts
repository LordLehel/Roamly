import { Request, Response } from 'express';
import { BaseController } from '../../utils/BaseController';
import * as fileService from './files.service';

class FilesController extends BaseController {
  public uploadPrivateDocument = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const file = req.file;

      const { document_type, issue_date, expiry_date } = req.body;

      if (!file) {
        res.status(400).json({
          status: 'error',
          message: 'No document provided!',
        });

        return;
      }

      const newFile = await fileService.uploadPrivateDocument(
        user.uuid,
        file,
        document_type,
        issue_date,
        expiry_date,
      );

      res.status(201).json({
        status: 'success',
        message: 'Private document uploaded successfully!',
        data: newFile,
      });
    },
  );

  public getPrivateDocumentUrl = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const fileId = parseInt(req.params.fileId as string, 10);

      const result = await fileService.getPrivateDocumentUrl(user.uuid, fileId);

      res.status(200).json({
        status: 'success',
        message: 'Temporary URL successfully generated! Link expires in 5 minutes!',
        data: {
          url: result.url,
          file_name: result.file.file_name,
          mime_type: result.file.mime_type,
          created_at: result.file.created_at,
        },
      });
    },
  );

  public deletePrivateDocument = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const fileId = parseInt(req.params.fileId as string, 10);

      await fileService.deletePrivateDocument(user.uuid, fileId);

      res.status(200).json({
        status: 'success',
        message: 'File deleted successfully!',
      });
    },
  );

  public getAllPrivateDocumentsMetadataOfAUser = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const documentsMetadata = await fileService.getAllPrivateDocumentsMetadataOfAUser(user.uuid);

      res.status(200).json({
        status: 'success',
        message: 'Private documents metadata successfully returned!',
      });
    },
  );
}

export default new FilesController();
