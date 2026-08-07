import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

// postgres connection url from the .env file
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// wrapping the connection into the Prisma adapter
const adapter = new PrismaPg(pool);

// instatntiating -> singleton Prisma klient
const prisma = new PrismaClient({ adapter });

// exporting -> other parts of the server will be able to use it too
export default prisma;
