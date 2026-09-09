import cron from 'node-cron';
import prisma from '../../prisma';

export const startCronJobs = (): void => {
  // '0 * * * *' -> it runs at every hours first minute
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();

      // deleting expired reset password requests
      const resetResult = await prisma.password_resets.deleteMany({
        where: {
          expires_at: {
            lt: now,
          },
        },
      });

      // deleting expired pending email verifications
      const pendingResult = await prisma.pending_users.deleteMany({
        where: {
          expires_at: {
            lt: now,
          },
        },
      });

      if (pendingResult.count > 0) {
        console.log(
          `[CRON] Successfully deleted ${pendingResult.count} expired pending_users record(s)!`,
        );
      }
      if (resetResult.count > 0) {
        console.log(
          `[CRON] Successfully deleted ${resetResult.count} expired password_resets record(s)!`,
        );
      }
    } catch (error: unknown) {
      console.error('[CRON ERROR] There was an error during the cleanup process: ', error);
    }
  });

  console.log('[CRON] Background processes started successfully!');
};
