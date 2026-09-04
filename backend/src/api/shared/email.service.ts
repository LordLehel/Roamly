import * as nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { config } from '../../config/env.config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// is the code in development or production state
const isProduction = config.nodeEnv === 'production';

// if the code is in prod we are using the Resend client
const resend = isProduction ? new Resend(config.email.resendApiKey) : null;

// if the code is in dev we use an Ethereal SMTP transporter
// it just mimics an email, it will not send real emails
let devTransporter: nodemailer.Transporter | null = null;

async function getDevTransporter(): Promise<nodemailer.Transporter> {
  if (devTransporter) {
    return devTransporter;
  }

  // generate the test account
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

// one sender function for both dev and prod
export const sendEmail = async ({ to, subject, html, text }: EmailOptions): Promise<void> => {
  const fromAddress = config.email.fromAddress || 'onboarding@resend.dev';

  if (isProduction && resend) {
    // prod (Resend api)
    const { error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('[EMAIL PROD ERROR] Failed to send via Resend:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  } else {
    // dev (Nodemailer + Ethereal)
    const transporter = await getDevTransporter();

    const info = await transporter.sendMail({
      from: `"App notification" <${fromAddress}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`[DEV EMAIL] Sent to: ${to}`);
    // generate an openable link to view the email
    console.log(`[DEV EMAIL PREVIEW] ${nodemailer.getTestMessageUrl(info)}`);
  }
};

// helper functions
export const sendEventAssignedEmail = async (
  to: string,
  eventTitle: string,
  eventDate: string,
): Promise<void> => {
  await sendEmail({
    to,
    subject: `You have been added to this event: "${eventTitle}"!`,
    html: `
        <h2>New event notification!</h2>
        <p>You have been added to this event: "${eventTitle}"!</p>
        <p><strong>This event will start on this date:</strong> ${eventDate}</p>
        <p>Further information about this event is available on the website, go check it out!</p>
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
        <h2>New group notification!</h2>
        <p>You have been invited to this group: "${groupName}" by ${inviterName}!</p>
        <p>You can accept the invite on the website.</p>
        <p>Further information about this invite is available on the website, go check it out!</p>
        `,
  });
};
