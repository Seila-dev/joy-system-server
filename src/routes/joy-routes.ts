import { Router } from "express"
import { JoyController } from "../http/controllers/joys-controller"
import { authMiddleware } from "../middlewares/auth"
import { 
    validateQuestCompletion, 
    validateQuestFailure, 
    validateTransactionHistoryLimit 
  } from "../validators/joys-validator"

const joyRoutes = Router()

joyRoutes.post(
    "/quests/:questId/complete",
    authMiddleware,
    validateQuestCompletion,
    new JoyController().completeQuest
)

joyRoutes.post(
    "/quests/:questId/fail", 
    authMiddleware, 
    validateQuestFailure,
    new JoyController().failQuest
)

joyRoutes.get(
    "/balance", 
    authMiddleware, 
    new JoyController().getJoyBalance
)

joyRoutes.get(
    "/transactions",
    authMiddleware,
    validateTransactionHistoryLimit,
    new JoyController().getJoyTransactionHistory
)

joyRoutes.get(
    "/reward",
    authMiddleware, 
    new JoyController().getJoyRewardEstimate
)

export default joyRoutes