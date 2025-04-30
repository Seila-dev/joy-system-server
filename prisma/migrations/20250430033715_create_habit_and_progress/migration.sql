-- CreateEnum
CREATE TYPE "HabitMethod" AS ENUM ('INSTANTANEO', 'QUANTIDADE');

-- CreateEnum
CREATE TYPE "HabitFrequency" AS ENUM ('DIARIAMENTE', 'SEMANALMENTE', 'MENSALMENTE');

-- CreateEnum
CREATE TYPE "HabitType" AS ENUM ('BOM', 'RUIM');

-- CreateTable
CREATE TABLE "habit_progress" (
    "id" SERIAL NOT NULL,
    "habit_id" INTEGER NOT NULL,
    "is_success" BOOLEAN NOT NULL DEFAULT true,
    "value" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habit_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habits" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "method" "HabitMethod" NOT NULL DEFAULT 'INSTANTANEO',
    "frequency" "HabitFrequency" NOT NULL DEFAULT 'DIARIAMENTE',
    "type" "HabitType" NOT NULL DEFAULT 'BOM',
    "duration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "habits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "habit_progress" ADD CONSTRAINT "habit_progress_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habits" ADD CONSTRAINT "habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
