-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ALTER COLUMN "resetTokenExpiry" DROP NOT NULL;
