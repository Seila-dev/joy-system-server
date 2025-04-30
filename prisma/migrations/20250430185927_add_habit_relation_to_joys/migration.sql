-- AlterTable
ALTER TABLE "habit_progress" ADD COLUMN     "joy_points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "joy_transaction_id" INTEGER;

-- AlterTable
ALTER TABLE "habits" ADD COLUMN     "failure_points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "success_points" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "habit_progress" ADD CONSTRAINT "habit_progress_joy_transaction_id_fkey" FOREIGN KEY ("joy_transaction_id") REFERENCES "joy_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
