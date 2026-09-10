import { Request, Response } from 'express';
import { BaseController } from '../../utils/BaseController';
import * as fileService from './files.service';
import * as FILE_CONSTANTS from '../../constants/files.constants';

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

      const type = req.query.type as FILE_CONSTANTS.urlType;

      const result = await fileService.getPrivateDocumentUrl(user.uuid, fileId, type);

      res.status(200).json({
        status: 'success',
        message: 'Temporary URL successfully generated! Link expires in 1 hour!',
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
        data: documentsMetadata,
      });
    },
  );

  public replacePrivateDocument = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const file = req.file;

      const oldFileId = parseInt(req.params.fileId as string, 10);

      const { document_type, issue_date, expiry_date } = req.body;

      const updatedFile = await fileService.replacePrivateDocument(
        user.uuid,
        oldFileId,
        document_type,
        file,
        issue_date,
        expiry_date,
      );

      res.status(200).json({
        status: 'success',
        message: file ? 'File replaced successfully!' : 'Document metadata replaced successfully',
        data: updatedFile,
      });
    },
  );

  public shareDocumentsWithGroup = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const fileId = parseInt(req.params.fileId as string, 10);

      const { groupUuid, accessLevel } = req.body;

      const sharingInformation = await fileService.shareDocumentsWithGroup(
        user.uuid,
        groupUuid,
        fileId,
        accessLevel,
      );

      res.status(201).json({
        status: 'success',
        message: 'File successfully shared!',
        data: sharingInformation,
      });
    },
  );

  public deleteSharing = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const fileId = parseInt(req.params.fileId as string, 10);

    const groupUuid = req.params.groupUuid as string;

    await fileService.deleteSharing(user.uuid, groupUuid, fileId);

    res.status(200).json({
      status: 'success',
      message: 'Sharing successfully revoked!',
    });
  });

  public updateSharingConditions = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const fileId = parseInt(req.params.fileId as string, 10);

      const groupUuid = req.params.groupUuid as string;

      const { accessLevel } = req.body;

      const updatedSharingConditions = await fileService.updateSharingConditions(
        user.uuid,
        groupUuid,
        fileId,
        accessLevel,
      );

      res.status(200).json({
        status: 'success',
        message: 'Updated sharing conditions successfully!',
        data: updatedSharingConditions,
      });
    },
  );

  public listAllGroupsADocumentIsSharedWith = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const fileId = parseInt(req.params.fileId as string, 10);

      const listOfGroupsTheDocIsSharedWith = await fileService.listAllGroupsADocumentIsSharedWith(
        user.uuid,
        fileId,
      );

      res.status(200).json({
        status: 'success',
        message: 'Listing of groups the document is shared with was successful!',
        data: listOfGroupsTheDocIsSharedWith,
      });
    },
  );

  public uploadGroupDocument = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;
      const file = req.file;
      const groupUuid = req.params.groupUuid as string;
      const { document_type, issue_date, expiry_date } = req.body;

      if (!file) {
        res.status(400).json({
          status: 'error',
          message: 'No document provided!',
        });

        return;
      }

      const uploadedDocument = await fileService.uploadGroupDocument(
        user.uuid,
        groupUuid,
        file,
        document_type,
        issue_date,
        expiry_date,
      );

      res.status(201).json({
        status: 'success',
        message: 'Group document uploaded successfully!',
        data: uploadedDocument,
      });
    },
  );

  public uploadGroupMediaFile = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const file = req.file;

      const groupUuid = req.params.groupUuid as string;

      const { description } = req.body;

      if (!file) {
        res.status(400).json({
          status: 'error',
          message: 'No media file provided!',
        });

        return;
      }

      const uploadedMedia = await fileService.uploadGroupMediaFile(
        user.uuid,
        groupUuid,
        file,
        description,
      );

      res.status(201).json({
        status: 'success',
        message: 'Group media file uploaded successfully!',
        data: uploadedMedia,
      });
    },
  );

  public updateGroupDocument = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const groupUuid = req.params.groupUuid as string;

      const fileId = parseInt(req.params.fileId as string, 10);

      const file = req.file;

      const { document_type, issue_date, expiry_date } = req.body;

      const updatedGroupDocument = await fileService.updateGroupDocument(
        user.uuid,
        groupUuid,
        fileId,
        document_type,
        file,
        issue_date,
        expiry_date,
      );

      res.status(200).json({
        status: 'success',
        message: 'Group document updated successfully!',
        data: updatedGroupDocument,
      });
    },
  );

  public updateGroupMediaFile = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const groupUuid = req.params.groupUuid as string;

      const fileId = parseInt(req.params.fileId as string, 10);

      const file = req.file;

      const { description } = req.body;

      const updatedGroupMedia = await fileService.updateGroupMediaFile(
        user.uuid,
        groupUuid,
        fileId,
        file,
        description,
      );

      res.status(200).json({
        status: 'success',
        message: 'Group media file updated successfully!',
        data: updatedGroupMedia,
      });
    },
  );

  public deleteGroupFile = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const groupUuid = req.params.groupUuid as string;

    const fileId = parseInt(req.params.fileId as string, 10);

    await fileService.deleteGroupFile(user.uuid, groupUuid, fileId);

    res.status(200).json({
      status: 'success',
      message: 'Group file deleted successfully!',
    });
  });

  public getGroupFiles = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const groupUuid = req.params.groupUuid as string;

    const limit = req.query.limit as unknown as number;

    const cursor = req.query.cursor as unknown as number | undefined;

    const type = req.query.type as unknown as string;

    const paginatedFiles = await fileService.getGroupFiles(
      user.uuid,
      groupUuid,
      limit,
      cursor,
      type,
    );

    res.status(200).json({
      status: 'success',
      message: 'Files of the group listed successfully!',
      data: paginatedFiles,
    });
  });

  public getAllPrivateDocumentsMetadataOfAllUsersInAGroup = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const groupUuid = req.params.groupUuid as string;

      const filters = {
        documentType: req.query.documentType as string | undefined,
        targetUserUuid: req.query.targetUserUuid as string | undefined,
      };

      const listOfAllPrivateDocuments =
        await fileService.getAllPrivateDocumentsMetadataOfAllUsersInAGroup(
          user.uuid,
          groupUuid,
          filters,
        );

      res.status(200).json({
        status: 'success',
        message: 'List of all private documents retrieved successfully!',
        data: listOfAllPrivateDocuments,
      });
    },
  );
}

export default new FilesController();
