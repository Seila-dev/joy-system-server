-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('FACIL', 'MEDIO', 'DIFICIL', 'MUITO_DIFICIL');

-- CreateEnum
CREATE TYPE "JoyTransactionType" AS ENUM ('GANHO', 'GASTO', 'BONUS', 'PENALIDADE');

-- AlterTable
ALTER TABLE "quests" ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIO',
ADD COLUMN     "joys" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "joys" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "currentBalance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "joys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "joy_transactions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "JoyTransactionType" NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quest_id" INTEGER,
    "joy_id" INTEGER,

    CONSTRAINT "joy_transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "joys" ADD CONSTRAINT "joys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "joy_transactions" ADD CONSTRAINT "joy_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "joy_transactions" ADD CONSTRAINT "joy_transactions_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "joy_transactions" ADD CONSTRAINT "joy_transactions_joy_id_fkey" FOREIGN KEY ("joy_id") REFERENCES "joys"("id") ON DELETE SET NULL ON UPDATE CASCADE;
