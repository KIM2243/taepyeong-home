const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const products = await prisma.product.findMany({ select: { id: true, name: true, imageUrl: true } });
  products.forEach(p => {
    console.log(`${p.name}: ${p.imageUrl}`);
  });
  await prisma.$disconnect();
}

run().catch(console.error);
