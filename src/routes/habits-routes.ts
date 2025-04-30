import { HabitController } from '../http/controllers/habits-controller';
import { authMiddleware } from '../middlewares/auth';
import { Router } from 'express';

const habitsRoutes = Router();

habitsRoutes.post(
    '/', 
    authMiddleware,
    new HabitController().create
)

habitsRoutes.get(
    '/', 
    authMiddleware,
    new HabitController().getAll
)

habitsRoutes.get(
    '/:id', 
    authMiddleware, 
    new HabitController().getUnique
)

habitsRoutes.put(
    '/:id', 
    authMiddleware, 
    new HabitController().update
)

habitsRoutes.delete(
    '/:id', 
    authMiddleware, 
    new HabitController().delete
)

habitsRoutes.post(
    '/:id/progress', 
    authMiddleware, 
    new HabitController().trackProgress
)

habitsRoutes.get(
    '/type/:type', 
    authMiddleware, 
    new HabitController().getByType
)

habitsRoutes.get(
    '/method/:method', 
    authMiddleware, 
    new HabitController().getByMethod
)

export default habitsRoutes;
