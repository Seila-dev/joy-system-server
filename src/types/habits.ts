import { HabitMethod, HabitFrequency, HabitType } from '@prisma/client';

export interface CreateHabit {
  title: string;
  description?: string;
  method: HabitMethod;
  frequency: HabitFrequency;
  type: HabitType;
  duration: number; 
}

export interface UpdateHabit {
  title?: string;
  description?: string;
  method?: HabitMethod;
  frequency?: HabitFrequency;
  type?: HabitType;
  duration?: number;
}

export interface HabitProgress {
  isSuccess: boolean; 
  value?: number; 
  date?: Date; 
}

export interface HabitWithProgress extends CreateHabit {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  progress?: HabitProgressDetail[];
}

export interface HabitProgressDetail {
  id: number;
  habitId: number;
  isSuccess: boolean;
  value: number;
  date: Date;
  createdAt: Date;
}