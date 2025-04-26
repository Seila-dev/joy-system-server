// MVC - MODEL / VIEW / CONTROLLER
import { Request, Response } from "express"
import { prisma } from "../../prisma"
import { Difficulty, QuestStatus } from "@prisma/client";

const DIFFICULTY_JOY_REWARDS = {
    FACIL: 2,
    MEDIO: 4,
    DIFICIL: 6,
    MUITO_DIFICIL: 8
}

export class QuestsController {

    async findAll(request: Request, response: Response) {
        try {
            const userId = request.user.id;
            const quests = await prisma.quest.findMany({
                where: {
                    userId: userId
                },
                orderBy: {
                    title: "asc"
                }
            })
            response.send(quests)
        } catch (error) {
            response.status(500).send(error)
        }
    }

    async create(request: Request, response: Response) {
        const userId = request.user.id
        const { title, description, validation, status, difficulty, highlight, timeline } = request.body;

        try {
        
            const validTimelines = ["DIARIO", "SEMANAL", "MENSAL", "ANUAL"];
            const validDifficulty = ["FACIL", "MEDIO", "DIFICIL", "MUITO_DIFICIL"];

            if (!validTimelines.includes(timeline)) {
                response.status(400).send({ message: "Categoria de timeline inválida" });
                return
            }

            if (!validDifficulty.includes(difficulty)) {
                response.status(400).send({ message: "Dificuldade inválida" });
                return
            }

            const joys = DIFFICULTY_JOY_REWARDS[difficulty as Difficulty];

            const quest = await prisma.quest.create({
                data: {
                    title,
                    description,
                    validation,
                    difficulty,
                    highlight: Boolean(highlight),
                    timeline,
                    userId,
                    joys: Number(joys),
                    status
                }
            });

            response.status(200).json(quest);
        } catch (error: any) {
            console.log(error)
            response.status(500).send({ message: "Erro ao criar a quest." })
        }
    }

    async update(request: Request, response: Response) {
        const userId = request.user.id
        const { title, description, validation, status, difficulty, highlight, timeline } = request.body;
        const { id } = request.params

        try {
            const validDifficulty = ["FACIL", "MEDIO", "DIFICIL", "MUITO_DIFICIL"];
            const validTimelines = ["DIARIO", "SEMANAL", "MENSAL", "ANUAL"];
    
            if (!validTimelines.includes(timeline)) {
                response.status(400).send({ message: "Categoria de timeline inválida" });
                return
            }
    
            if (!validDifficulty.includes(difficulty)) {
                response.status(400).send({ message: "Dificuldade inválida" });
                return
            }

            const existingQuest = await prisma.quest.findUnique({
                where: {
                    id: Number(id),
                },
            })
            if (!existingQuest) {
                response.status(404).send({ message: "Quest não encontrada" })
                return
            }

            if (existingQuest.userId !== userId) {
                response.status(403).send({ message: "Você não tem permissão para editar esta quest" })
                return
            }

            if (existingQuest.status === QuestStatus.COMPLETO || existingQuest.status === QuestStatus.INCOMPLETO) {
                if (status !== existingQuest.status) {
                    response.status(400).send({ 
                        message: "Quest já finalizada. Não é possível alterar o status de uma quest completa ou incompleta." 
                    })
                    return
                }
            }

            const joys = DIFFICULTY_JOY_REWARDS[difficulty as Difficulty];

            const updatedQuest = await prisma.quest.update({
                where: {
                    id: Number(id)
                },
                data: {
                    title,
                    description,
                    validation,
                    difficulty,
                    highlight: Boolean(highlight),
                    timeline,
                    userId,
                    joys: Number(joys),
                    status
                }
            })

            response.status(200).send({ updatedQuest })
        } catch (error) {
            console.log('erro', error)
            response.status(500).send({ message: "Houve um erro" })
        }
    }

    async destroy(request: Request, response: Response) {
        const { id } = request.params
        const userId = request.user.id;

        try {
            const quest = await prisma.quest.findUnique({
                where: {
                    id: Number(id)
                }
            })

            if (!quest) {
                response.status(404).send({ message: "Quest não encontrada" });
                return
            }

            if (quest.userId !== userId) {
                response.status(403).send({ message: "Você não tem permissão para deletar essa quest" });
                return
            }

            await prisma.quest.delete({
                where: {
                    id: Number(id)
                }
            })

            response.status(200).send({ message: "Deletado com sucesso" })
        } catch (error) {
            console.log('erro', error)
            response.status(500).send({ message: "Houve um erro" })
        }
    }
}