import { PrismaClient } from '@prisma/client'
import JoyService from './joys-service'

const joyService = new JoyService()


class StoreService {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }


    async getAllProducts(userId: number) {
        return this.prisma.product.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                price: 'asc'
            }
        })
    }

    async getProductsById(productId: number) {
        return this.prisma.product.findUnique({
            where: {
                id: productId
            }
        })
    }

    async createProduct(productData: {
        name: string;
        description: string;
        price: number;
        featured: boolean;
        userId: number;
    }) {
        return this.prisma.product.create({
            data: {
                name: productData.name,
                description: productData.description,
                price: productData.price,
                featured: productData.featured,
                userId: productData.userId
            }
        })
    }

    async updateProduct(
        productId: number,
        productData: {
            name?: string;
            description?: string;
            price?: number;
            featured?: boolean;
            isActive?: boolean;
            userId: number;
        }
    ) {
        const updateData: any = {};
        if (productData.name) updateData.name = productData.name;
        if (productData.description) updateData.description = productData.description;
        if (productData.price !== undefined) updateData.price = productData.price;
        if (productData.featured !== undefined) updateData.featured = productData.featured;
        if (productData.isActive !== undefined) updateData.isActive = productData.isActive;
        if (productData.userId !== undefined) updateData.userId = productData.userId;

        return this.prisma.product.update({
            where: {
                id: productId
            },
            data: updateData
        })
    }

    async deleteProduct(productId: number) {
        return this.prisma.product.delete({
            where: {
                id: productId
            }
        })
    }

    async createPurchase(userId: number, productId: number, quantity: number, totalPrice: number){
        return this.prisma.$transaction(async (tx) => {
            const existingUserProduct = await tx.userProduct.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    }
                }
            })

            if (existingUserProduct) {
                throw new Error('User already owns this product')
            }

            const purchase = await tx.purchase.create({
                data: {
                    userId,
                    productId,
                    quantity,
                    totalPrice
                }
            })

            const joyTransaction = await tx.joyTransaction.create({
                data: {
                    userId,
                    amount: -totalPrice,
                    type: 'COMPRA',
                    description: `Purchase of product #${productId}`,
                    purchaseId: purchase.id,
                    joyId: (await tx.joy.findFirst({ where: { userId } }))?.id
                }
            })

            await joyService.updateJoyBalance(userId, -totalPrice, tx)

            const userProduct = await tx.userProduct.create({
                data: {
                    userId,
                    productId,
                    purchasedAt: new Date(),
                    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day from now
                }
            })

            return {
                purchase,
                joyTransaction,
                userProduct
            }
    })}

    async getUserProducts(userId: number) {
        return this.prisma.userProduct.findMany({
            where: {
                userId,
                isActive: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                  ]
            },
            include: {
                product: true
            }
        })
    }

    async getPurchaseHistory(userId: number) {
        return this.prisma.purchase.findMany({
            where: {
                userId
            },
            include: {
                product: true,
                joyTransaction: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }
}

export default StoreService