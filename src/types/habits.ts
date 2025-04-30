import { HabitMethod, HabitFrequency, HabitType } from '@prisma/client';

export interface CreateHabit {
  title: string;
  description?: string;
  method: HabitMethod;
  frequency: HabitFrequency;
  type: HabitType;
  duration: number;
  successPoints: number;
  failurePoints: number;
  userId: number;
}

export interface UpdateHabit {
  title?: string;
  description?: string;
  method?: HabitMethod;
  frequency?: HabitFrequency;
  type?: HabitType;
  duration?: number;
  successPoints?: number;
  failurePoints?: number;
}

export interface RecordProgress {
  habitId: number;
  isSuccess: boolean;
  value?: number;
  date?: Date;
  userId: number;
}