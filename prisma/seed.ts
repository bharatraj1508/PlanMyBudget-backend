import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const users = Array.from({ length: 10 }, (_, i) => ({
    first_name: `User${i + 1}`,
    last_name: `Last${i + 1}`,
    email: `user${i + 1}@example.com`,
    password: `password${i}`,
  }));

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
