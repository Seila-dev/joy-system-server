-- CreateEnum
CREATE TYPE "NoteCategory" AS ENUM ('PESSOAL', 'TRABALHO', 'IDEIAS', 'LEMBRETES', 'METAS', 'OUTRO');

-- CreateEnum
CREATE TYPE "NoteStatus" AS ENUM ('ATIVO', 'ARQUIVADO', 'FIXADO');

-- CreateTable
CREATE TABLE "notes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "NoteCategory" NOT NULL DEFAULT 'OUTRO',
    "status" "NoteStatus" NOT NULL DEFAULT 'ATIVO',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT,
    "user_id" INTEGER NOT NULL,
    "quest_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "quests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
