/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `joy_transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "joy_transactions_user_id_key" ON "joy_transactions"("user_id");
