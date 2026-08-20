import dotenv from 'dotenv';

// load .env file into process.env
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  r2: {
    endpoint: string;
    publicAccessKeyId: string;
    publicSecretAccessKey: string;
    publicBucketName: string;
    publicUrl: string;

    privateAccessKeyId: string;
    privateSecretAccessKey: string;
    privateBucketName: string;
  };
}

// helper to enforce required variables at startup
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const config: Config = {
  port: parseInt(getEnvVar('PORT', '3000'), 10),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  r2: {
    endpoint: getEnvVar('R2_ENDPOINT'),
    publicAccessKeyId: getEnvVar('R2_PUBLIC_ACCESS_KEY_ID'),
    publicSecretAccessKey: getEnvVar('R2_PUBLIC_SECRET_ACCESS_KEY'),
    publicBucketName: getEnvVar('R2_PUBLIC_BUCKET_NAME'),
    publicUrl: getEnvVar('R2_PUBLIC_URL'),

    privateAccessKeyId: getEnvVar('R2_PRIVATE_ACCESS_KEY_ID'),
    privateSecretAccessKey: getEnvVar('R2_PRIVATE_SECRET_ACCESS_KEY'),
    privateBucketName: getEnvVar('R2_PRIVATE_BUCKET_NAME'),
  },
};
