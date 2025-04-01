import { Router } from "express"
import { QuestsController } from "../http/controllers/quests-controller"
import { authMiddleware } from "../middlewares/auth"

const questsRoutes = Router()

questsRoutes.get(
    "/",
    authMiddleware, 
    new QuestsController().findAll
)

questsRoutes.post(
    "/", 
    authMiddleware, 
    new QuestsController().create
)

questsRoutes.delete(
    "/:id", 
    authMiddleware, 
    new QuestsController().destroy
)

questsRoutes.put(
    "/:id", 
    authMiddleware, 
    new QuestsController().update
)

export default questsRoutes