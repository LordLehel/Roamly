/*
  Warnings:

  - You are about to alter the column `file_size` on the `files` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to drop the column `tel` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `groups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `events` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "users_tel_key";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "file_size" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "tel",
ADD COLUMN     "phone_number" VARCHAR(20);

-- CreateTable
CREATE TABLE "file_shares" (
    "file_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "shared_by" INTEGER,
    "shared_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "access_level" VARCHAR(32) NOT NULL DEFAULT 'ALL',

    CONSTRAINT "file_shares_pkey" PRIMARY KEY ("file_id","group_id")
);

-- CreateTable
CREATE TABLE "pending_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" TEXT,
    "otp" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pending_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pending_users_email_key" ON "pending_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "events_uuid_key" ON "events"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "groups_uuid_key" ON "groups"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "roles_type_key" ON "roles"("type");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- AddForeignKey
ALTER TABLE "file_shares" ADD CONSTRAINT "file_shares_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("file_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "file_shares" ADD CONSTRAINT "file_shares_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "file_shares" ADD CONSTRAINT "file_shares_shared_by_fkey" FOREIGN KEY ("shared_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;
