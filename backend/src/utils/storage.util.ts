import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import crypto from 'crypto';
import path from 'node:path';
import { config } from '../config/env.config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// initializing public client with S3 compatible settings
const publicS3Client = new S3Client({
  region: 'auto',
  endpoint: config.r2.endpoint,
  credentials: {
    accessKeyId: config.r2.publicAccessKeyId,
    secretAccessKey: config.r2.publicSecretAccessKey,
  },
});

const privateS3Client = new S3Client({
  region: 'auto',
  endpoint: config.r2.endpoint,
  credentials: {
    accessKeyId: config.r2.privateAccessKeyId,
    secretAccessKey: config.r2.privateSecretAccessKey,
  },
});

// public ----------------------------------------------

// upload the file from memory to the cloud
export const uploadPublicFileToCloud = async (
  file: Express.Multer.File,
  folder: string = 'profiles',
): Promise<string> => {
  // generate safe, unique name for the file
  const extension = path.extname(file.originalname);
  const uniqueFileName = `${folder}/${crypto.randomUUID()}${extension}`;

  // putting together the command for our Cloud provider
  const command = new PutObjectCommand({
    Bucket: config.r2.publicBucketName,
    Key: uniqueFileName,
    // we give it the file from the memory
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  // sending it to the Cloud
  await publicS3Client.send(command);

  // returning the public URL path
  return `${config.r2.publicUrl}/${uniqueFileName}`;
};

// delete file from cloud
export const deletePublicFileFromCloud = async (publicUrl: string): Promise<void> => {
  try {
    // get the file name (key) out of the URL
    const baseUrl = `${config.r2.publicUrl}/`;
    const key = publicUrl.replace(baseUrl, '');

    // delete command
    const command = new DeleteObjectCommand({
      Bucket: config.r2.publicBucketName,
      Key: key,
    });

    await publicS3Client.send(command);
  } catch (error) {
    console.error('Error! There was an issue while deleting public files: ', error);
  }
};

// private ---------------------------------------------

// upload the file from memory to the cloud
export const uploadPrivateFileToCloud = async (
  file: Express.Multer.File,
  folder: string = 'documents',
): Promise<string> => {
  // generate safe, unique name for the file
  const extension = path.extname(file.originalname);
  const uniqueFileName = `${folder}/${crypto.randomUUID()}${extension}`;

  // putting together the command for our Cloud provider
  const command = new PutObjectCommand({
    Bucket: config.r2.privateBucketName,
    Key: uniqueFileName,
    // we give it the file from the memory
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  // sending it to the Cloud
  await privateS3Client.send(command);

  // returning only the key (file name) without the URL to be more secure
  return uniqueFileName;
};

// get a URL that let's the user check his private document for 1 day
export const getPrivatePresignedUrl = async (fileKey: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: config.r2.privateBucketName,
    Key: fileKey,
  });

  // URL is live for 1 day
  return await getSignedUrl(privateS3Client, command, { expiresIn: 60 * 60 * 24 });
};

// delete file from cloud
export const deletePrivateFilesFromCloud = async (fileKeys: string[]): Promise<void> => {
  if (fileKeys.length === 0) {
    return;
  }

  try {
    // delete command
    const command = new DeleteObjectsCommand({
      Bucket: config.r2.privateBucketName,
      Delete: {
        Objects: fileKeys.map((key: string) => ({ Key: key })),
        Quiet: true,
      },
    });

    await privateS3Client.send(command);
  } catch (error) {
    console.error('Error! There was an issue while deleting private files: ', error);
  }
};
