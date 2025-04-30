import { PrismaClient, Habit, HabitProgress, HabitMethod, HabitFrequency, HabitType, JoyTransactionType } from '@prisma/client'
import { CreateHabit, UpdateHabit, RecordProgress } from '../types/habits';
import { AppError } from '../validators/AppError';

const prisma = new PrismaClient();

class HabitService {
  async create(data: CreateHabit): Promise<Habit> {
    const habit = await prisma.habit.create({
      data
    });

    return habit;
  }

  async findById(id: number, userId: number): Promise<Habit> {
    const habit = await prisma.habit.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!habit) {
      throw new AppError('Hábito não encontrado', 404);
    }

    return habit;
  }

  async list(userId: number): Promise<Habit[]> {
    const habits = await prisma.habit.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return habits;
  }

  async update(id: number, userId: number, data: UpdateHabit): Promise<Habit> {
    await this.findById(id, userId);

    const updatedHabit = await prisma.habit.update({
      where: {
        id
      },
      data
    });

    return updatedHabit;
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.findById(id, userId);

    await prisma.habit.delete({
      where: {
        id
      }
    });
  }

  async recordProgress(data: RecordProgress): Promise<HabitProgress> {
    const { habitId, isSuccess, value = 0, userId, date = new Date() } = data;
    
    const habit = await this.findById(habitId, userId);

    const joyPoints = isSuccess ? habit.successPoints : -habit.failurePoints;

    return await prisma.$transaction(async (tx) => {
      const progress = await tx.habitProgress.create({
        data: {
          habitId,
          isSuccess,
          value,
          joyPoints,
          date
        }
      });

      if (joyPoints !== 0) {
        const joyTransaction = await tx.joyTransaction.create({
          data: {
            userId,
            amount: joyPoints,
            type: isSuccess ? JoyTransactionType.GANHO : JoyTransactionType.PENALIDADE,
            description: `${isSuccess ? 'Completou' : 'Falhou'} o hábito: ${habit.title}`,
            habitProgress: {
              connect: {
                id: progress.id
              }
            }
          }
        });

        const joy = await tx.joy.findFirst({
          where: {
            userId
          }
        });

        if (joy) {
          await tx.joy.update({
            where: {
              id: joy.id
            },
            data: {
              currentBalance: joy.currentBalance + joyPoints
            }
          });
        } else {
          await tx.joy.create({
            data: {
              userId,
              currentBalance: joyPoints
            }
          });
        }

        await tx.habitProgress.update({
          where: {
            id: progress.id
          },
          data: {
            joyTransactionId: joyTransaction.id
          }
        });
      }

      return progress;
    });
  }

  async getProgress(habitId: number, userId: number, startDate?: Date, endDate?: Date): Promise<HabitProgress[]> {
    await this.findById(habitId, userId);

    const dateFilter: { gte?: Date; lte?: Date } = {};
    
    if (startDate) {
      dateFilter['gte'] = startDate;
    }
    
    if (endDate) {
      dateFilter['lte'] = endDate;
    }

    const progress = await prisma.habitProgress.findMany({
      where: {
        habitId,
        ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {})
      },
      orderBy: {
        date: 'desc'
      },
      include: {
        joyTransaction: true
      }
    });

    return progress;
  }

  async getHabitStats(habitId: number, userId: number): Promise<{
    totalCompletions: number;
    totalFailures: number;
    completionRate: number;
    currentStreak: number;
    longestStreak: number;
    totalJoyPoints: number;
  }> {
    const habit = await this.findById(habitId, userId);

    const progress = await prisma.habitProgress.findMany({
      where: {
        habitId
      },
      orderBy: {
        date: 'desc'
      }
    });

    const totalCompletions = progress.filter(p => p.isSuccess).length;
    const totalFailures = progress.filter(p => !p.isSuccess).length;
    const completionRate = progress.length > 0 
      ? (totalCompletions / progress.length) * 100 
      : 0;
    
    let currentStreak = 0;
    let i = 0;
    while (i < progress.length && progress[i].isSuccess) {
      currentStreak++;
      i++;
    }

    let longestStreak = 0;
    let currentStreakCount = 0;
    for (const p of progress) {
      if (p.isSuccess) {
        currentStreakCount++;
        if (currentStreakCount > longestStreak) {
          longestStreak = currentStreakCount;
        }
      } else {
        currentStreakCount = 0;
      }
    }

    const totalJoyPoints = progress.reduce((sum, p) => sum + p.joyPoints, 0);

    return {
      totalCompletions,
      totalFailures,
      completionRate,
      currentStreak,
      longestStreak,
      totalJoyPoints
    };
  }
}

export default new HabitService();