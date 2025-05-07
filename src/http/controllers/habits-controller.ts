import { Request, Response } from 'express';
import habitService from '../../services/habits-service';
import { Habit, HabitMethod, HabitType } from '@prisma/client';
import { AppError } from '../../validators/AppError';
import { CreateHabit, UpdateHabit, RecordProgress } from '../../types/habits';

class HabitController {
  async create(req: Request, res: Response){
    try {
      const { title, description, method, frequency, type, duration, successPoints, failurePoints } = req.body
      const userId = req.user.id; 

      const data: CreateHabit = {
        title,
        description,
        method,
        frequency,
        type,
        duration,
        successPoints,
        failurePoints,
        userId
      }

      const habit = await habitService.create(data)
      res.status(201).json(habit)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user.id

      const habit = await habitService.findById(Number(id), userId)
      res.json(habit)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async list(req: Request, res: Response){
    try {
      const userId = req.user.id
      const habits = await habitService.list(userId)
      res.json(habits)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async update(req: Request, res: Response){
    try {
      const { id } = req.params
      const userId = req.user.id
      const { title, description, method, frequency, type, duration, successPoints, failurePoints } = req.body

      const data: UpdateHabit = {}
      if (title !== undefined) data.title = title
      if (description !== undefined) data.description = description
      if (method !== undefined) data.method = method
      if (frequency !== undefined) data.frequency = frequency
      if (type !== undefined) data.type = type
      if (duration !== undefined) data.duration = duration
      if (successPoints !== undefined) data.successPoints = successPoints
      if (failurePoints !== undefined) data.failurePoints = failurePoints

      const habit = await habitService.update(Number(id), userId, data)
      res.json(habit)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user.id

      await habitService.delete(Number(id), userId)
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async recordProgress(req: Request, res: Response) {
    try {
      const { habitId } = req.params
      const userId = req.user.id
      const { isSuccess, value, date } = req.body

      const data: RecordProgress = {
        habitId: Number(habitId),
        isSuccess,
        value,
        date: date ? new Date(date) : undefined,
        userId
      };

      const progress = await habitService.recordProgress(data)
      res.status(201).json(progress)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async getProgress(req: Request, res: Response) {
    try {
      const { habitId } = req.params
      const userId = req.user.id
      const { startDate, endDate } = req.query

      const progress = await habitService.getProgress(
        Number(habitId), 
        userId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.json(progress)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async getHabitStats(req: Request, res: Response) {
    try {
      const { habitId } = req.params
      const userId = req.user.id

      const stats = await habitService.getHabitStats(Number(habitId), userId)
      res.json(stats)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}

export default new HabitController();