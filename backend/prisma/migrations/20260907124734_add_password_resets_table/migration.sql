/*
  Warnings:

  - You are about to alter the column `email` on the `pending_users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(254)`.
  - You are about to alter the column `username` on the `pending_users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `password` on the `pending_users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `phone_number` on the `pending_users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `otp` on the `pending_users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(6)`.
  - A unique constraint covering the columns `[phone_number]` on the table `pending_users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pending_users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(254),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "phone_number" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "otp" SET DATA TYPE VARCHAR(6),
ALTER COLUMN "expires_at" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "otp" VARCHAR(6) NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_email_key" ON "password_resets"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pending_users_phone_number_key" ON "pending_users"("phone_number");
