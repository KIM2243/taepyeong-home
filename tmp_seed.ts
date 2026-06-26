import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: { password: '1212' },
    create: { username: 'admin', password: '1212' },
  });
  console.log('Admin seeded successfully.');
}
main().catch(console.error).finally(() => prisma.$disconnect());
