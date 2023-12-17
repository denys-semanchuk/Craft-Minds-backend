-- DropIndex
DROP INDEX "users_id_key";

-- AlterTable
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
