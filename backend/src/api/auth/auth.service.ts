import prisma from '../../prisma';
import { Prisma, users } from '@prisma/client';
import { hashPassword, validatePassword } from '../../utils/password.utils';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../utils/ServerError';
import * as sendMail from '../shared/email.service';
import crypto from 'crypto';

// 6 characters long code
const generateOtp = (): string => crypto.randomInt(100000, 1000000).toString();

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  phone_number?: string,
): Promise<void> => {
  // does the email already exist
  const existingUser = await prisma.users.findUnique({ where: { email } });

  if (existingUser) {
    throw new ConflictError('This email address is already is use!');
  }

  // is the phone number already in use
  const existingPhoneNumber = await prisma.users.findUnique({
    where: {
      phone_number,
    },
  });

  if (existingPhoneNumber) {
    throw new ConflictError('This phone number is already in use!');
  }

  const hashedPasswd = await hashPassword(password);

  const otp = generateOtp();

  // it lives for only 15 minutes
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  // using upsert so if someone registers twice
  // before verifying the email address we just update
  await prisma.pending_users.upsert({
    where: {
      email,
    },
    update: {
      username,
      password: hashedPasswd,
      phone_number,
      otp,
      expires_at: expiresAt,
    },
    create: {
      email,
      username,
      password: hashedPasswd,
      phone_number,
      otp,
      expires_at: expiresAt,
    },
  });

  sendMail.sendOtpEmail(email, otp, username).catch((err: unknown) => {
    console.error(`[EMAIL ERROR] Failed to send Otp to ${email}: `, err);
  });
};

// resend the Otp email
export const resendVerificationEmail = async (email: string): Promise<void> => {
  const pendingUser = await prisma.pending_users.findUnique({ where: { email } });

  if (!pendingUser) {
    throw new NotFoundError('There is no pending verification with this email!');
  }

  const newOtp = generateOtp();

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.pending_users.update({
    where: {
      email,
    },
    data: {
      otp: newOtp,
      expires_at: expiresAt,
    },
  });

  sendMail.sendOtpEmail(email, newOtp, pendingUser.username).catch((err: unknown) => {
    console.error(`[EMAIL ERROR] Failed to resend Otp to ${email}`, err);
  });
};

export const verifyEmailAndCreateUser = async (email: string, otp: string): Promise<users> => {
  const pendingUser = await prisma.pending_users.findUnique({
    where: {
      email,
    },
  });

  if (!pendingUser) {
    throw new BadRequestError('Invalid or expired code!');
  }
  if (pendingUser.otp !== otp) {
    throw new BadRequestError('Incorrect code!');
  }
  if (pendingUser.expires_at < new Date()) {
    throw new BadRequestError('This code already expired! You should ask for a new one!');
  }

  const newUser = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const createdUser = await tx.users.create({
      data: {
        email: pendingUser.email,
        username: pendingUser.username,
        password: pendingUser.password,
        phone_number: pendingUser.phone_number,
      },
    });

    await tx.pending_users.delete({
      where: {
        email,
      },
    });

    return createdUser;
  });

  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<users> => {
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new UnauthorizedError('Incorrect email or password!');
  }

  const isMatch = await validatePassword(password, user.password);

  if (!isMatch) {
    throw new UnauthorizedError('Incorrect email or password!');
  }

  return user;
};

export const requestForgottenPasswordReset = async (email: string): Promise<void> => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new NotFoundError('There is no registered user with this email address!');
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  // upsert -> if the user already requested a code we just override it
  await prisma.password_resets.upsert({
    where: {
      email,
    },
    update: {
      otp,
      expires_at: expiresAt,
    },
    create: {
      email,
      otp,
      expires_at: expiresAt,
    },
  });

  // sending code in email
  sendMail.sendPasswordResetEmail(email, otp, user.username).catch((err: unknown) => {
    console.error(`[EMAIL ERROR] Failed to send reset otp to ${user.username}: `, err);
  });
};

export const resetForgottenPassword = async (
  email: string,
  otp: string,
  newPassword: string,
): Promise<void> => {
  const resetRequest = await prisma.password_resets.findUnique({
    where: {
      email,
    },
  });

  if (!resetRequest) {
    throw new BadRequestError('Invalid, or expired code!');
  }
  if (resetRequest.otp !== otp) {
    throw new BadRequestError('Incorrect code!');
  }
  if (resetRequest.expires_at < new Date()) {
    throw new BadRequestError('This code has alredy expired! You should request a new one!');
  }

  const hashedNewPassword = await hashPassword(newPassword);

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.users.update({
      where: {
        email,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    await tx.password_resets.delete({
      where: {
        email,
      },
    });
  });
};
