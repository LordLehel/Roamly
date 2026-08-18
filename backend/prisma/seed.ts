import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { ROLES } from '../src/constants/roles.constants';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  console.log('Seeding database...');

  const leaderRole = await prisma.roles.upsert({
    where: { type: ROLES.LEADER },
    update: {},
    create: { type: ROLES.LEADER },
  });

  const memberRole = await prisma.roles.upsert({
    where: { type: ROLES.MEMBER },
    update: {},
    create: { type: ROLES.MEMBER },
  });

  const invitedLeaderRole = await prisma.roles.upsert({
    where: { type: ROLES.INVITEDLEADER },
    update: {},
    create: { type: ROLES.INVITEDLEADER },
  });

  const invitedMemberRole = await prisma.roles.upsert({
    where: { type: ROLES.INVITEDMEMBER },
    update: {},
    create: { type: ROLES.INVITEDMEMBER },
  });

  console.log(
    `Seeding finished successfully! Roles created: ${leaderRole.type}, ${memberRole.type}, \
${invitedLeaderRole.type}, ${invitedMemberRole.type}`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error: unknown) => {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.log('Unknown error happend while seeding the database!');
    }
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
