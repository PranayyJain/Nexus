const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const docCount = await prisma.document.count();
  const userCount = await prisma.user.count();
  const projCount = await prisma.project.count();
  const taskCount = await prisma.task.count();
  
  console.log('--- DB STATUS ---');
  console.log('Documents:', docCount);
  console.log('Users:', userCount);
  console.log('Projects:', projCount);
  console.log('Tasks:', taskCount);
  
  if (docCount > 0) {
    const docs = await prisma.document.findMany({ take: 1 });
    console.log('First Doc:', docs[0].title);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
