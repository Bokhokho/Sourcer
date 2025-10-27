// CommonJS version – works everywhere
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const members = ['Imane', 'Oussama', 'Zakaria', 'Karim', 'Shelbry'];
  for (const name of members) {
    await prisma.member.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

main()
  .then(async () => {
    console.log('✅ Seeding complete');
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error('❌ Seeding failed:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
