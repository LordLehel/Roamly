import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import path from 'node:path';
import { config } from '../config/env.config';

// initializing client with S3  compatible settings
const s3Client = new S3Client({
  region: 'auto',
  endpoint: config.r2.endpoint,
  credentials: {
    accessKeyId: config.r2.accessKeyId,
    secretAccessKey: config.r2.secretAccessKey,
  },
});

// upload the file from memory to the cloud
export const uploadFileToCloud = async (
  file: Express.Multer.File,
  folder: string = 'profiles',
): Promise<string> => {
  // generate safe, unique name for the file
  const extension = path.extname(file.originalname);
  const uniqueFileName = `${folder}/${crypto.randomUUID()}${extension}`;

  // putting together the command for our Cloud provider
  const command = new PutObjectCommand({
    Bucket: config.r2.bucketName,
    Key: uniqueFileName,
    // we give it the file from the memory
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  // sending it to the Cloud
  await s3Client.send(command);

  // returning the public URL path
  return `${config.r2.publicUrl}/${uniqueFileName}`;
};

// delete file from cloud
export const deleteFileFromCloud = async (publicUrl: string): Promise<void> => {
  try {
    // get the file name (key) out of the URL
    const baseUrl = `${config.r2.publicUrl}/`;
    const key = publicUrl.replace(baseUrl, '');

    // delete command
    const command = new DeleteObjectCommand({
      Bucket: config.r2.bucketName,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error! There was an issue while deleting the file: ', error);
  }
};
