import { Request, Response } from "express"
import JoyService from "../../services/joys-service"
import { Difficulty } from "@prisma/client"

const DIFFICULTY_JOY_REWARDS = {
    FACIL: 2,
    MEDIO: 4,
    DIFICIL: 6,
    MUITO_DIFICIL: 8
}

const DIFFICULTY_JOY_PENALTIES = {
    FACIL: -1,
    MEDIO: -2,
    DIFICIL: -3,
    MUITO_DIFICIL: -4
}

const joyService = new JoyService()

export class JoyController {
    async completeQuest(req: Request, res: Response) {
        try {
            const userId = req.user.id
            const { questId } = req.params

            const result = await joyService.completeQuest(Number(questId), userId)

            res.status(200).json({
                message: "Quest completada com sucesso",
                quest: result.quest,
                joyEarned: result.joy.currentBalance
            })
        } catch (error: any) {
            console.error("Erro ao completar quest: ", error)

            if (error.message.includes("não encontrada")) {
                res.status(404).json({
                    message: "Quest não encontrada ou não pertence ao usuário"
                })
                return
            }

            res.status(500).json({
                message: "Erro interno ao processar conclusão da quest"
            })
        }
    }

    async failQuest(req: Request, res: Response) {
        try {
            const userId = req.user.id
            const { questId } = req.params

            const result = await joyService.failQuest(Number(questId), userId)

            res.status(200).json({
                message: "Quest marcada como não completada",
                quest: result.quest,
                joyPenalty: result.joy.currentBalance
            })
        } catch (error: any) {
            console.error("Erro ao processar falha na quest:", error)

            if (error.message.includes("não encontrada")) {
                res.status(404).json({
                    message: "Quest não encontrada ou não pertence ao usuário"
                })
                return
            }

            res.status(500).json({
                message: "Erro interno ao processar falha na quest"
            })
        }
    }

    async getJoyBalance(req: Request, res: Response) {
        try {
            const userId = req.user.id

            const balance = await joyService.getUserJoyBalance(userId)

            res.status(200).json({
                message: "Saldo de Joys recuperado com sucesso",
                balance
            })
        } catch (error) {
            console.error("Erro ao recuperar saldo de Joys:", error)

            res.status(500).json({
                message: "Erro interno ao recuperar saldo de Joys"
            })
        }
    }

    async getJoyTransactionHistory(req: Request, res: Response) {
        try {
            const userId = req.user.id
            const { limit } = req.query

            const transactions = await joyService.getJoyTransactionHistory(
                userId,
                limit ? Number(limit) : undefined
            )

            res.status(200).json({
                message: "Histórico de transações recuperado",
                transactions
            })
        } catch (error) {
            console.error("Erro ao recuperar histórico de transações:", error)

            res.status(500).json({
                message: "Erro interno ao recuperar histórico de transações"
            })
        }
    }

    async getJoyRewardEstimate(req: Request, res: Response) {
        try {
            const difficulty = req.query.difficulty as string

            if (!difficulty || !['FACIL', 'MEDIO', 'DIFICIL', 'MUITO_DIFICIL'].includes(difficulty)) {
                res.status(400).json({ error: 'Nível de dificuldade inválido' })
                return
            }

            const joyService = new JoyService()
            const reward = await joyService.getJoyRewardEstimate(difficulty as Difficulty)
            res.json(reward)
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

}