-- DropIndex
DROP INDEX "joy_transactions_user_id_key";

-- AlterTable
ALTER TABLE "habit_progress" ADD COLUMN     "notes" TEXT;
