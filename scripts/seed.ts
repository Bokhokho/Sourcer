import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const members = ['Imane', 'Younes', 'Zakaria', 'Karim', 'Shelbry'];
  for (const name of members) {
    await prisma.member.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });