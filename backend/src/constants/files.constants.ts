export const OWNERSHIP = {
  PRIVATE: 'PRIVATE',
  GROUP: 'GROUP',
} as const;

export type Ownership = (typeof OWNERSHIP)[keyof typeof OWNERSHIP];

export const BUCKET_FOLDER_NAME = {
  DOCUMENT: 'document',
  GROUP_FILES: 'group_files',
} as const;

export type BucketFolderName = (typeof BUCKET_FOLDER_NAME)[keyof typeof BUCKET_FOLDER_NAME];

export const GROUP_FILE_TYPE = {
  DOCUMENT: 'document',
  MEDIA_FILE: 'media',
} as const;

export type GroupFileType = (typeof GROUP_FILE_TYPE)[keyof typeof GROUP_FILE_TYPE];
