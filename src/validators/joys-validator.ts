import { body, param, query } from "express-validator"
import { validationResult } from "express-validator"
import { Request, Response, NextFunction } from "express"

// Middleware de validação genérico
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }
  next()
}

export const validateQuestCompletion = [
  param("questId")
    .isInt({ min: 1 })
    .withMessage("ID da quest deve ser um número inteiro positivo"),
  validateRequest
]

export const validateQuestFailure = [
  param("questId")
    .isInt({ min: 1 })
    .withMessage("ID da quest deve ser um número inteiro positivo"),
  validateRequest
]

export const validateTransactionHistoryLimit = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limite deve ser um número entre 1 e 100"),
  validateRequest
]