import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

async function deleteProductWithDependencies(productId: number) {
    try {
      // Step 1: Delete related UserProduct records first
      await prisma.userProduct.deleteMany({
        where: {
          productId: productId, // Replace with the product ID you want to delete
        },
      });
  
      // Step 2: Delete related Purchase records
      await prisma.purchase.deleteMany({
        where: {
          productId: productId, // Replace with the product ID you want to delete
        },
      });
  
      // Step 3: Delete the product itself
      await prisma.product.delete({
        where: {
          id: productId, // Replace with the product ID you want to delete
        },
      });
  
      console.log(`Product with ID ${productId} and its related records were deleted successfully.`);
    } catch (error) {
      console.error("Error deleting product and its related records:", error);
    }
  }
  
  // Call the function with the product ID you want to delete
  deleteProductWithDependencies(1); // Replace 123 with the actual product ID
  