import { StoreController } from '../http/controllers/store-controller';
import { authMiddleware } from '../middlewares/auth';
import { Router } from 'express';

const productsRoutes = Router();

productsRoutes.get(
    '/products', 
    authMiddleware,
    new StoreController().getProducts
)

productsRoutes.get(
    '/products/:id', 
    authMiddleware,
    new StoreController().getProductById
)

productsRoutes.post(
    '/products', 
    authMiddleware, 
    new StoreController().createProduct
)

productsRoutes.put(
    '/products/:id', 
    authMiddleware, 
    new StoreController().updateProduct
)

productsRoutes.delete(
    '/products/:id', 
    authMiddleware, 
    new StoreController().deleteProduct
)

productsRoutes.post(
    '/purchase', 
    authMiddleware, 
    new StoreController().purchaseProduct
)

export default productsRoutes;
