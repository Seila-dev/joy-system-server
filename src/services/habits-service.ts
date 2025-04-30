import { PrismaClient, Habit, HabitMethod, HabitFrequency, HabitType } from '@prisma/client';
import { CreateHabit, UpdateHabit, HabitProgress } from '../types/habits';

const prisma = new PrismaClient();

class HabitService {
  async createHabit(userId: number, habitData: CreateHabit): Promise<Habit> {
    return prisma.habit.create({
      data: {
        ...habitData,
        userId,
      },
    });
  }

  async getUserHabits(userId: number): Promise<Habit[]> {
    return prisma.habit.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getHabitById(habitId: number, userId: number): Promise<Habit | null> {
    return prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
    });
  }

  async updateHabit(habitId: number, userId: number, habitData: UpdateHabit): Promise<Habit> {
    return prisma.habit.update({
      where: {
        id: habitId,
        userId,
      },
      data: habitData,
    });
  }

  async deleteHabit(habitId: number, userId: number): Promise<Habit> {
    return prisma.habit.delete({
      where: {
        id: habitId,
        userId,
      },
    });
  }

  async trackHabitProgress(habitId: number, userId: number, progress: HabitProgress): Promise<any> {
    const habit = await this.getHabitById(habitId, userId);
    
    if (!habit) {
      throw new Error('Hábito não encontrado');
    }

    return prisma.habitProgress.create({
      data: {
        habitId,
        isSuccess: progress.isSuccess,
        value: progress.value || 0,
        date: new Date(),
      },
    });
  }

  async getHabitsByType(userId: number, type: HabitType): Promise<Habit[]> {
    return prisma.habit.findMany({
      where: {
        userId,
        type,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getHabitsByMethod(userId: number, method: HabitMethod): Promise<Habit[]> {
    return prisma.habit.findMany({
      where: {
        userId,
        method,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

export default new HabitService();