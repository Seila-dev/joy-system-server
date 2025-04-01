import { Request, Response } from 'express';
import StoreService from '../../services/store-service';
import JoyService from '../../services/joys-service';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const joyService = new JoyService()
const storeService = new StoreService()

export class StoreController {
    async getProducts(req: Request, res: Response) {
        try {
            
            const userId = req.user.id
            console.log(userId)
            if (!userId) {
                res.status(400).json({ error: 'User ID and Product ID are required' })
                return
            }
            const products = await storeService.getAllProducts(userId) 
            res.status(200).json(products)
        } catch (error) {
            console.log('ooii')
            console.error(error)
            res.status(500).send(error)
        }
    }

    async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params
            const product = await storeService.getProductsById(parseInt(id))

            if (!product) {
                res.status(404).json({ error: 'Product not found' })
                return
            }

            res.status(200).json(product)
        } catch (error) {
            console.error('Error fetching product:', error)
            res.status(500).json({ error: 'Failed to fetch product details' })
        }
    }

    async purchaseProduct(req: Request, res: Response) {
        try {
            const { userId, productId, quantity = 1 } = req.body;

            if (!userId || !productId) {
                res.status(400).json({ error: 'User ID and Product ID are required' })
                return
            }

            const userJoy = await joyService.getUserJoyBalance(userId);
            const product = await storeService.getProductsById(productId);

            if (!product) {
                res.status(404).json({ error: 'Product not found' })
                return
            }

            const totalPrice = product.price * quantity;

            if (userJoy < totalPrice) {
                res.status(400).json({
                    error: 'Insufficient Joy balance',
                    required: totalPrice,
                    available: userJoy
                })
                return
            }

            const purchase = await storeService.createPurchase(userId, productId, quantity, totalPrice)
            res.status(201).json(purchase)
        } catch (error) {
            console.error('Error processing purchase:', error)
            res.status(500).json({ error: 'Failed to process purchase' })
        }
    }

    async getUserProducts(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const userProducts = await storeService.getUserProducts(parseInt(userId))
            res.status(200).json(userProducts)
        } catch (error) {
            console.error('Error fetching user products:', error)
            res.status(500).json({ error: 'Failed to fetch user products' })
        }
    }

    async createProduct(req: Request, res: Response) {
        try {
            const { name, description, price, featured } = req.body;
            const userId = req.user.id

            if (!name || !description || !price) {
                res.status(400).json({ error: 'Name, description and price are required' })
                return
            }

            const product = await storeService.createProduct({
                name,
                description,
                price,
                featured,
                userId
            })

            res.status(201).json(product)
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: 'Failed to create product' });
        }
    }

    async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params
            const userId = req.user.id
            const { name, description, price, featured, isActive } = req.body

            const product = await storeService.updateProduct(parseInt(id), {
                name,
                description,
                price,
                featured,
                userId,
                isActive
            })

            if (!product) {
                res.status(404).json({ error: 'Product not found' })
                return
            }

            res.status(200).json(product)
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Failed to update product' })
        }
    }

    async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params

            const product = await prisma.product.delete({
                where: {
                    id: Number(id)
                }
            })

            res.status(200).json(product)
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'Failed to delete product' });
        }
    }

    async deleteAllPurchases(req: Request, res: Response) {
        try {
            const products = await prisma.product.deleteMany({})

            res.status(200).json(products)
        } catch (error) {
            console.error('Error deleting all products:', error);
            res.status(500).json({ error: 'Failed to delete all products' });
        }
    }

    async getPurchaseHistory(req: Request, res: Response) {
        try {
            const { userId } = req.params
            const purchases = await storeService.getPurchaseHistory(parseInt(userId))
            res.status(200).json(purchases)
        } catch (error) {
            console.error('Error fetching purchase history:', error);
            res.status(500).json({ error: 'Failed to fetch purchase history' })
        }
    }
}
