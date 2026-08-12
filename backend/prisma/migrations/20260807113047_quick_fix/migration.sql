/*
  Warnings:

  - You are about to drop the column `file_type` on the `documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "documents" DROP COLUMN "file_type",
ADD COLUMN     "document_type" VARCHAR(64);
