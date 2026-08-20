import { files, file_shares } from '@prisma/client';
import prisma from '../../prisma';
import * as cloudOperations from '../../utils/storage.util';
import { ForbiddenError } from '../../utils/ServerError';
import { privateDocumentMetadata } from '../../types/files.types';

export const uploadPrivateDocument = async (
  userUuid: string,
  fileData: Express.Multer.File,
  document_type: string,
  issue_date: string,
  expiry_date: string,
): Promise<files> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const fileKey = await cloudOperations.uploadPrivateFileToCloud(fileData, 'document');

  const newFile = await prisma.files.create({
    data: {
      file_name: fileData.originalname,
      file_url: fileKey,
      file_size: fileData.size,
      mime_type: fileData.mimetype,
      ownership_type: 'PRIVATE',
      user_id: user.user_id,
      uploaded_by: user.user_id,

      documents: {
        create: {
          document_type: document_type,
          issue_date: issue_date ? new Date(issue_date) : null,
          expiry_date: expiry_date ? new Date(expiry_date) : null,
        },
      },
    },

    include: {
      documents: true,
    },
  });

  return newFile;
};

export const getPrivateDocumentUrl = async (
  userUuid: string,
  fileId: number,
): Promise<{ url: string; file: files }> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const file = await prisma.files.findUniqueOrThrow({
    where: {
      file_id: fileId,
    },
    include: {
      file_shares: true,
    },
  });

  const isOwner = file.user_id === user.user_id;

  // check if the user has permission to the link bcs the file is shared in a group
  let hasGroupAccess = false;

  if (!isOwner && file.file_shares.length > 0) {
    const userGroups = await prisma.group_profiles.findMany({
      where: {
        user_id: user.user_id,
      },
      select: {
        group_id: true,
      },
    });

    const userGroupIds = userGroups.map((g: { group_id: number }) => g.group_id);

    hasGroupAccess = file.file_shares.some((share: file_shares) =>
      userGroupIds.includes(share.group_id),
    );
  }

  if (!isOwner && !hasGroupAccess) {
    throw new ForbiddenError('User does not have permission to view document!');
  }

  const presignedUrl = await cloudOperations.getPrivatePresignedUrl(file.file_url);

  return {
    url: presignedUrl,
    file: file,
  };
};

export const deletePrivateDocument = async (userUuid: string, fileId: number): Promise<void> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const file = await prisma.files.findUniqueOrThrow({
    where: {
      file_id: fileId,
    },
  });

  // validate authorization
  if (file.user_id !== user.user_id) {
    throw new ForbiddenError('Users can only delete their own files!');
  }

  // deleting from Cloud
  await cloudOperations.deletePrivateFilesFromCloud([file.file_url]);

  // deleting from database table
  await prisma.files.delete({
    where: {
      file_id: file.file_id,
    },
  });
};

export const getAllPrivateDocumentsMetadataOfAUser = async (
  userUuid: string,
): Promise<privateDocumentMetadata[]> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const privateDocumentsMetadata = await prisma.files.findMany({
    where: {
      user_id: user.user_id,
      ownership_type: 'PRIVATE',
    },
    include: {
      documents: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return privateDocumentsMetadata;
};
