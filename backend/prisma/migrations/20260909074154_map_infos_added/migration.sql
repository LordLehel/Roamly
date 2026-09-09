-- DropIndex
DROP INDEX "pending_users_phone_number_key";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "address" VARCHAR(255),
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;
