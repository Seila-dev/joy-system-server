import { Router } from 'express'
import habitController from '../http/controllers/habits-controller'
import { authMiddleware } from '../middlewares/auth'
import validate from '../validators/habits-validator'
import { body, param, query } from 'express-validator'
import { HabitMethod, HabitFrequency, HabitType } from '@prisma/client'

const habitRoutes = Router()

habitRoutes.use(authMiddleware)

habitRoutes.post(
  '/',
  [
    body('title').notEmpty().withMessage('O título é obrigatório'),
    body('method')
      .isIn(Object.values(HabitMethod))
      .withMessage('Método inválido'),
    body('frequency')
      .isIn(Object.values(HabitFrequency))
      .withMessage('Frequência inválida'),
    body('type')
      .isIn(Object.values(HabitType))
      .withMessage('Tipo inválido'),
    body('duration')
      .isInt({ min: 1 })
      .withMessage('A duração deve ser um número inteiro positivo'),
    body('successPoints')
      .isInt({ min: 0 })
      .withMessage('Os pontos de sucesso devem ser um número inteiro não negativo'),
    body('failurePoints')
      .isInt({ min: 0 })
      .withMessage('Os pontos de falha devem ser um número inteiro não negativo'),
    validate,
  ],
  habitController.create
)

habitRoutes.get('/', habitController.list);

habitRoutes.get(
  '/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    validate,
  ],
  habitController.findById
)

habitRoutes.put(
  '/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('title').optional(),
    body('method')
      .optional()
      .isIn(Object.values(HabitMethod))
      .withMessage('Método inválido'),
    body('frequency')
      .optional()
      .isIn(Object.values(HabitFrequency))
      .withMessage('Frequência inválida'),
    body('type')
      .optional()
      .isIn(Object.values(HabitType))
      .withMessage('Tipo inválido'),
    body('duration')
      .optional()
      .isInt({ min: 1 })
      .withMessage('A duração deve ser um número inteiro positivo'),
    body('successPoints')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Os pontos de sucesso devem ser um número inteiro não negativo'),
    body('failurePoints')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Os pontos de falha devem ser um número inteiro não negativo'),
    validate,
  ],
  habitController.update
)

habitRoutes.delete(
  '/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    validate,
  ],
  habitController.delete
)

habitRoutes.post(
  '/:habitId/progress',
  [
    param('habitId').isInt().withMessage('ID do hábito deve ser um número inteiro'),
    body('isSuccess').isBoolean().withMessage('isSuccess deve ser um booleano'),
    body('value').optional().isInt().withMessage('value deve ser um número inteiro'),
    body('date').optional().isISO8601().withMessage('Data deve estar no formato ISO8601'),
    validate,
  ],
  habitController.recordProgress
)

habitRoutes.get(
  '/:habitId/progress',
  [
    param('habitId').isInt().withMessage('ID do hábito deve ser um número inteiro'),
    query('startDate').optional().isISO8601().withMessage('Data inicial deve estar no formato ISO8601'),
    query('endDate').optional().isISO8601().withMessage('Data final deve estar no formato ISO8601'),
    validate,
  ],
  habitController.getProgress
)

habitRoutes.get(
  '/:habitId/stats',
  [
    param('habitId').isInt().withMessage('ID do hábito deve ser um número inteiro'),
    validate,
  ],
  habitController.getHabitStats
)

export default habitRoutes