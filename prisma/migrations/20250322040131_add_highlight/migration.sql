/*
  Warnings:

  - You are about to drop the column `userId` on the `quests` table. All the data in the column will be lost.
  - Added the required column `highlight` to the `quests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `quests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "quests" DROP CONSTRAINT "quests_userId_fkey";

-- AlterTable
ALTER TABLE "quests" DROP COLUMN "userId",
ADD COLUMN     "highlight" BOOLEAN NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "quests" ADD CONSTRAINT "quests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
