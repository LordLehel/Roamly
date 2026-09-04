import nodemailer from 'nodemailer';
import { Resend } from 'resend';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const isProduction = process.env.NODE_ENV === 'production';

const resend = isProduction ? new Resend(process.env.RESEND_API_KEY) : null;

let devTransporter: nodemailer.Transporter | null = null;

async function getDevTramsporter(): Promise<nodemailer.Transporter> {
  if (devTransporter) {
    return devTransporter;
  }

  const testAccount = await nodemailer.createTestAccount();

  devTransporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return devTransporter;
}

export const sendEmails = async ({ to, subject, html, test }: EmailOptions): Promise<void> => {
  const fromAddress = process.env.EMAIL_FROM || 'onboarding@resend.dev';

  if (isProduction && resend) {
    const { error } = resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('[EMAIL PROD ERROR] Failed to send vie Resend:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  } else {
    const transporter = await getDevTramsporter();

    const info = await transporter.sendMail({
      from: `"App notification" <${fromAddress}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`[DEV EMAIL] Sent to: ${to}`);
    console.log(`[DEV EMAIL PREVIEW] ${nodemailer.getTestMessageUrl(info)}`);
  }
};

export const sendEventAssignedEmail = async (
  to: string,
  eventTitle: string,
  eventDate: string,
): Promise<void> => {
  await sendEmail({
    to,
    subject: `You have been added to this event: "${eventTitle}"!`,
    html: `
        <h2>New event notification!<h2>
        <p>You have been added to this event: "${eventTitle}"!<p>
        <p><strong>This event will start on this date: ${eventDate}<p>
        <p>Further information about this event is available on the website, go check it out!<p>
        `,
  });
};

export const sendGroupInvitedEmail = async (
  to: string,
  groupName: string,
  inviterName: string,
): Promise<void> => {
  await sendEmail({
    to,
    subject: `You have been invited to this group: "${groupName}"!`,
    html: `
        <h2>New group notification!<h2>
        <p>You have been invited to this group: "${groupName}" by ${inviterName}!<p>
        <p>Further information about this group is available on the website, go check it out!<p>
        `,
  });
};
