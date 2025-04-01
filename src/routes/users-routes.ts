import { Router } from "express";
import { UsersController } from "../http/controllers/users-controller";
import { authMiddleware } from "../middlewares/auth";
import { StoreController } from "../http/controllers/store-controller";

const usersRoutes = Router()

usersRoutes.post(
    "/check-email", 
    new UsersController().checkEmail
)

usersRoutes.post(
    "/", 
    new UsersController().create
)

usersRoutes.post(
    "/login", 
    new UsersController().login
)

usersRoutes.get(
    "/", 
    authMiddleware, 
    new UsersController().profile
)

usersRoutes.get(
    '/:userId/products',
    authMiddleware, 
    new StoreController().getUserProducts
)

usersRoutes.get(
    '/:userId/purchases', 
    authMiddleware, 
    new StoreController().getPurchaseHistory
)

usersRoutes.delete(
    '/:userId/purchases', 
    authMiddleware, 
    new StoreController().deleteAllPurchases
)

export default usersRoutes