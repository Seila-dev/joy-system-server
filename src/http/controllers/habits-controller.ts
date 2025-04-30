import { Request, Response } from 'express';
import habitService from '../../services/habits-service';
import { HabitMethod, HabitType } from '@prisma/client';

export class HabitController {
  async create(req: Request, res: Response){
    const userId = req.user.id
    const habitData = req.body
    
    const habit = await habitService.createHabit(userId, habitData)
    
    res.status(201).json({
      success: true,
      data: habit,
    })
  }

  async getAll(req: Request, res: Response){
    const userId = req.user.id
    const habits = await habitService.getUserHabits(userId)
    
    res.status(200).json({
      success: true,
      data: habits,
    })
  }

  async getUnique(req: Request, res: Response) {
    const userId = req.user.id;
    const habitId = parseInt(req.params.id, 10);
    
    const habit = await habitService.getHabitById(habitId, userId);
    
    if (!habit) {
      res.status(404).json({
        success: false,
        message: 'Hábito não encontrado',
      })
    }
    
     res.status(200).json({
      success: true,
      data: habit,
    })
  }

  async update(req: Request, res: Response) {
    const userId = req.user.id
    const habitId = parseInt(req.params.id, 10)
    const habitData = req.body
    
    try {
      const updatedHabit = await habitService.updateHabit(habitId, userId, habitData)
      
      res.status(200).json({
        success: true,
        data: updatedHabit,
      })
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'Hábito não encontrado ou você não tem permissão',
      })
    }
  }

  async delete(req: Request, res: Response) {
    const userId = req.user.id
    const habitId = parseInt(req.params.id, 10)
    
    try {
      await habitService.deleteHabit(habitId, userId)
      
      res.status(200).json({
        success: true,
        message: 'Hábito removido com sucesso',
      })
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'Hábito não encontrado ou você não tem permissão',
      })
    }
  }

  async trackProgress(req: Request, res: Response){
    const userId = req.user.id
    const habitId = parseInt(req.params.id, 10)
    const progressData = req.body
    
    try {
      const progress = await habitService.trackHabitProgress(habitId, userId, progressData)
      
      res.status(201).json({
        success: true,
        data: progress,
        message: progressData.isSuccess ? 'Progresso registrado com sucesso!' : 'Falha registrada com sucesso.'
      })
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Erro ao registrar progresso do hábito',
      })
    }
  }

  async getByType(req: Request, res: Response){
    const userId = req.user.id
    const type = req.params.type as HabitType
    
    const habits = await habitService.getHabitsByType(userId, type)
    
    res.status(200).json({
      success: true,
      data: habits,
    })
  }

  async getByMethod(req: Request, res: Response) {
    const userId = req.user.id
    const method = req.params.method as HabitMethod
    
    if (!Object.values(HabitMethod).includes(method)) {
      res.status(400).json({
        success: false,
        message: 'Método de hábito inválido. Use INSTANTANEO ou QUANTIDADE.',
      })
    }
    
    const habits = await habitService.getHabitsByMethod(userId, method)
    
    res.status(200).json({
      success: true,
      data: habits,
    })
  }
}
