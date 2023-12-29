-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_conversationId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "conversationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
