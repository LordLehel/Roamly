import { PrismaClient } from '@prisma/client'; 
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

// postgres kapcsolat .env mappabol
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// kapcsolat becsomagolasa a Prisma adapterebe
const adapter = new PrismaPg(pool);

// peldanyositas -> singleton Prisma kliens
const prisma = new PrismaClient({ adapter });

// exportalas -> a szerver tobbi resze is hasznalhassa
export default prisma;