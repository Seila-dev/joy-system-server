import { PrismaClient, Difficulty, JoyTransactionType, QuestStatus } from '@prisma/client'

// Configuração de recompensas baseadas na dificuldade
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

class JoyService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async completeQuest(questId: number, userId: number) {
        try {
            return this.prisma.$transaction(async (prisma) => {
                const quest = await prisma.quest.findUnique({
                    where: {
                        id: questId,
                        userId
                    }
                })

                if (!quest) {
                    throw new Error('Quest não encontrada ou não pertence ao usuário')
                }

                if (quest.status === QuestStatus.COMPLETO || quest.status === QuestStatus.INCOMPLETO) {
                    throw new Error('Não é possível alterar o status de uma quest já finalizada')
                }

                const joyReward = DIFFICULTY_JOY_REWARDS[quest.difficulty]

                const updatedQuest = await prisma.quest.update({
                    where: { id: questId },
                    data: {
                        status: QuestStatus.COMPLETO
                    }
                })

                let userJoy = await prisma.joy.findFirst({
                    where: { userId }
                })

                if (!userJoy) {
                    userJoy = await prisma.joy.create({
                        data: {
                            userId,
                            currentBalance: joyReward
                        }
                    })
                } else {
                    userJoy = await prisma.joy.update({
                        where: { id: userJoy.id },
                        data: {
                            currentBalance: {
                                increment: joyReward
                            }
                        }
                    })
                }

                await prisma.joyTransaction.create({
                    data: {
                        userId,
                        amount: joyReward,
                        type: JoyTransactionType.GANHO,
                        description: `Recompensa por completar quest: ${quest.title}`,
                        questId: quest.id,
                        joyId: userJoy.id
                    }
                })

                return {
                    quest: updatedQuest,
                    joy: userJoy
                }
            })
        } catch (error) {
            console.error('Error on completing test: ', error)
            throw error
        }
    }

    async updateJoyBalance(userId: number, amount: number, txClient?: any) {
        const client = txClient || this.prisma;
        
        let joy = await client.joy.findFirst({
          where: { userId }
        });
    
        if (!joy) {
          throw new Error('Joy record not found for user');
        }
    
        return client.joy.update({
          where: { id: joy.id },
          data: {
            currentBalance: joy.currentBalance + amount
          }
        });
      }

    async failQuest(questId: number, userId: number) {
        try {
            return this.prisma.$transaction(async (prisma) => {
                // Buscar detalhes da quest
                const quest = await prisma.quest.findUnique({
                    where: {
                        id: questId,
                        userId
                    }
                })

                if (!quest) {
                    throw new Error('Quest não encontrada ou não pertence ao usuário')
                }

                if (quest.status === QuestStatus.COMPLETO || quest.status === QuestStatus.INCOMPLETO) {
                    throw new Error('Não é possível alterar o status de uma quest já finalizada')
                }

                const joyPenalty = DIFFICULTY_JOY_PENALTIES[quest.difficulty]

                const updatedQuest = await prisma.quest.update({
                    where: { id: questId },
                    data: {
                        status: QuestStatus.INCOMPLETO
                    }
                })

                let userJoy = await prisma.joy.findFirst({
                    where: { userId }
                })

                if (!userJoy) {
                    userJoy = await prisma.joy.create({
                        data: {
                            userId,
                            currentBalance: joyPenalty
                        }
                    })
                } else {
                    userJoy = await prisma.joy.update({
                        where: { id: userJoy.id },
                        data: {
                            currentBalance: {
                                increment: joyPenalty
                            }
                        }
                    })
                }

                await prisma.joyTransaction.create({
                    data: {
                        userId,
                        amount: Math.abs(joyPenalty),
                        type: JoyTransactionType.PENALIDADE,
                        description: `Penalidade por não completar quest: ${quest.title}`,
                        questId: quest.id,
                        joyId: userJoy.id
                    }
                })

                return { quest: updatedQuest, joy: userJoy }
            })
        } catch (error) {
            console.error('Error on processing fail on quest:', error)
            throw error
        }
    }

    async getUserJoyBalance(userId: number) {
        const joy = await this.prisma.joy.findFirst({
            where: { userId }
        })

        return joy ? joy.currentBalance : 0
    }

    async getJoyTransactionHistory(userId: number, limit = 10) {
        return this.prisma.joyTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                quest: true,
                joy: true
            }
        })
    }

    async getJoyRewardEstimate(difficulty: Difficulty) {
        // Check if the provided difficulty is valid
        if (!Object.keys(DIFFICULTY_JOY_REWARDS).includes(difficulty)) {
          throw new Error('Invalid difficulty level')
        }
        
        return {
          joys: DIFFICULTY_JOY_REWARDS[difficulty]
        }
      }
}

export default JoyService