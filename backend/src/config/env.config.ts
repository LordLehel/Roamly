import dotenv from 'dotenv';

// load .env file into process.env
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  r2: {
    endpoint: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    publicUrl: string;
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
    accessKeyId: getEnvVar('R2_ACCESS_KEY_ID'),
    secretAccessKey: getEnvVar('R2_SECRET_ACCESS_KEY'),
    bucketName: getEnvVar('R2_BUCKET_NAME'),
    publicUrl: getEnvVar('R2_PUBLIC_URL'),
  },
};
