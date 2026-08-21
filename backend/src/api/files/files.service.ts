import { files, file_shares, Prisma } from '@prisma/client';
import prisma from '../../prisma';
import * as cloudOperations from '../../utils/storage.util';
import { BadRequestError, ConflictError, ForbiddenError } from '../../utils/ServerError';
import { docSharedWithGroups, privateDocumentMetadata } from '../../types/files.types';

export const uploadPrivateDocument = async (
  userUuid: string,
  fileData: Express.Multer.File,
  document_type: string,
  issue_date?: string,
  expiry_date?: string,
): Promise<files> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const existingDocsCount = await prisma.files.count({
    where: {
      user_id: user.user_id,
      ownership_type: 'PRIVATE',
      documents: {
        document_type: document_type,
      },
    },
  });

  if (existingDocsCount >= 3) {
    throw new BadRequestError(
      `You already uploaded 3 files of type: ${document_type}, if you want to replace one, try the replace option!`,
    );
  }

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

export const replacePrivateDocument = async (
  userUuid: string,
  fileId: number,
  document_type: string,
  fileData?: Express.Multer.File,
  issue_date?: string,
  expiry_date?: string,
): Promise<files> => {
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
    throw new ForbiddenError('Users can only replace their own files!');
  }

  const updateData: Prisma.filesUpdateInput = {
    documents: {
      update: {
        document_type: document_type,
        issue_date: issue_date ? new Date(issue_date) : null,
        expiry_date: expiry_date ? new Date(expiry_date) : null,
      },
    },
  };

  if (fileData) {
    // deleting old file from Cloud
    await cloudOperations.deletePrivateFilesFromCloud([file.file_url]);

    const fileKey = await cloudOperations.uploadPrivateFileToCloud(fileData, 'document');

    updateData.file_name = fileData.originalname;
    updateData.file_url = fileKey;
    updateData.file_size = fileData.size;
    updateData.mime_type = fileData.mimetype;
  }

  const updatedFile = await prisma.files.update({
    where: {
      file_id: fileId,
    },
    data: updateData,
    include: {
      documents: true,
    },
  });

  return updatedFile;
};

export const shareDocumentsWithGroup = async (
  userUuid: string,
  groupUuid: string,
  fileId: number,
  accessLevel: string,
): Promise<file_shares> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const group = await prisma.groups.findUniqueOrThrow({
    where: {
      uuid: groupUuid,
    },
  });

  const file = await prisma.files.findUniqueOrThrow({
    where: {
      file_id: fileId,
    },
  });

  // validate authorization
  if (file.user_id !== user.user_id) {
    throw new ForbiddenError('Users can only share their own files!');
  }

  // validate membership in group
  const isPartOfTheGroup = await prisma.group_profiles.findFirst({
    where: {
      user_id: user.user_id,
      group_id: group.group_id,
    },
  });

  if (!isPartOfTheGroup) {
    throw new ForbiddenError('Users can only share files to groups they are part of!');
  }

  if (file.ownership_type !== 'PRIVATE') {
    throw new BadRequestError('Users can share only their private files with other groups!');
  }

  // is the file already shared
  const alreadyShared = await prisma.file_shares.findFirst({
    where: {
      file_id: file.file_id,
      group_id: group.group_id,
    },
  });

  if (alreadyShared) {
    throw new ConflictError('File already shared with group!');
  }

  const sharingData = await prisma.file_shares.create({
    data: {
      file_id: file.file_id,
      group_id: group.group_id,
      shared_by: user.user_id,
      access_level: accessLevel,
    },
  });

  return sharingData;
};

export const deleteSharing = async (
  userUuid: string,
  groupUuid: string,
  fileId: number,
): Promise<void> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const group = await prisma.groups.findUniqueOrThrow({
    where: {
      uuid: groupUuid,
    },
  });

  const file = await prisma.files.findUniqueOrThrow({
    where: {
      file_id: fileId,
    },
  });

  // validate authorization
  if (file.user_id !== user.user_id) {
    throw new ForbiddenError('Users can only delete sharing of their own files!');
  }

  const isShared = await prisma.file_shares.findFirst({
    where: {
      file_id: file.file_id,
      group_id: group.group_id,
    },
  });

  if (!isShared) {
    throw new BadRequestError('File must be shared before revoking the sharing!');
  }

  await prisma.file_shares.delete({
    where: {
      file_id_group_id: {
        file_id: file.file_id,
        group_id: group.group_id,
      },
    },
  });
};

export const updateSharingConditions = async (
  userUuid: string,
  groupUuid: string,
  fileId: number,
  accessLevel: string,
): Promise<file_shares> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: userUuid,
    },
  });

  const group = await prisma.groups.findUniqueOrThrow({
    where: {
      uuid: groupUuid,
    },
  });

  const file = await prisma.files.findUniqueOrThrow({
    where: {
      file_id: fileId,
    },
  });

  // validate authorization
  if (file.user_id !== user.user_id) {
    throw new ForbiddenError('Users can only update sharing conditions of their own files!');
  }

  const isShared = await prisma.file_shares.findFirst({
    where: {
      file_id: file.file_id,
      group_id: group.group_id,
    },
  });

  if (!isShared) {
    throw new BadRequestError('File must be shared before updating the sharing conditions!');
  }

  const updatedSharingConditions = await prisma.file_shares.update({
    where: {
      file_id_group_id: {
        file_id: file.file_id,
        group_id: group.group_id,
      },
    },
    data: {
      access_level: accessLevel,
    },
  });

  return updatedSharingConditions;
};

export const listAllGroupsADocumentIsSharedWith = async (
  userUuid: string,
  fileId: number,
): Promise<docSharedWithGroups[]> => {
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
    throw new ForbiddenError('Users can only list sharing data of their own files!');
  }

  const docSharedWithGroups = await prisma.file_shares.findMany({
    where: {
      file_id: file.file_id,
    },
    select: {
      shared_by: true,
      shared_at: true,
      access_level: true,

      groups: {
        select: {
          name: true,
        },
      },
    },
  });

  return docSharedWithGroups;
};
