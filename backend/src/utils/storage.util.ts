import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import path from 'node:path';

// initializing client with S3  compatible settings
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
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
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: uniqueFileName,
    // we give it the file from the memory
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  // sending it to the Cloud
  await s3Client.send(command);

  // returning the public URL path
  return `${process.env.R2_PUBLIC_URL}/${uniqueFileName}`;
};
