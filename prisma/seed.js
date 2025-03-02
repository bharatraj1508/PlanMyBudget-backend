import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with multiple records...");

  // Generate hashed passwords for users
  const passwordHash = await hash("password123", 10);

  // Create Users
  const users = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.user.create({
        data: {
          first_name: `User${i + 1}`,
          last_name: `Test`,
          username: `user${i + 1}`,
          email: `user${i + 1}@example.com`,
          password: passwordHash,
          currency: "USD",
        },
      })
    )
  );

  // Create Budget Types
  const budgetTypes = ["NEED", "WANT", "SAVING"];
  const budgetTypeRecords = await Promise.all(
    budgetTypes.map((type) =>
      prisma.budgetType.create({
        data: { name: type },
      })
    )
  );

  // Create Categories (Linked to Budget Types)
  const categoriesData = [
    { name: "Rent", type: "NEED" },
    { name: "Groceries", type: "NEED" },
    { name: "Insurance", type: "NEED" },
    { name: "Entertainment", type: "WANT" },
    { name: "Shopping", type: "WANT" },
    { name: "Dining Out", type: "WANT" },
    { name: "Savings Account", type: "SAVING" },
    { name: "Investments", type: "SAVING" },
    { name: "Emergency Fund", type: "SAVING" },
  ];

  const categories = await Promise.all(
    categoriesData.map(async (cat) => {
      const budgetType = budgetTypeRecords.find((bt) => bt.name === cat.type);
      return prisma.category.create({
        data: { name: cat.name, typeId: budgetType?.id ?? "" },
      });
    })
  );

  // Create Income Records for Users
  const incomeSources = ["Job", "Freelancing", "Rental Income", "Investments"];
  const incomes = await Promise.all(
    users.flatMap((user) =>
      Array.from({ length: 2 }, () =>
        prisma.income.create({
          data: {
            userId: user.id,
            source:
              incomeSources[Math.floor(Math.random() * incomeSources.length)],
            amount: Math.floor(Math.random() * 5000) + 1000,
            tax: Math.floor(Math.random() * 500),
            netAmount: Math.floor(Math.random() * 4500) + 500,
          },
        })
      )
    )
  );

  // Create Budgets for Users
  const budgets = await Promise.all(
    users.flatMap((user) =>
      Array.from({ length: 2 }, () =>
        prisma.budget.create({
          data: {
            userId: user.id,
            type: ["WEEKLY", "BIWEEKLY", "MONTHLY"][
              Math.floor(Math.random() * 3)
            ],
            totalLimit: Math.floor(Math.random() * 5000) + 1000,
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          },
        })
      )
    )
  );

  // Create Expenditures for Budgets
  const expenditures = await Promise.all(
    budgets.flatMap((budget) =>
      Array.from({ length: 3 }, () => {
        const category =
          categories[Math.floor(Math.random() * categories.length)];
        return prisma.expenditure.create({
          data: {
            budgetId: budget.id,
            categoryId: category.id,
            cost: Math.floor(Math.random() * 1000) + 100,
          },
        });
      })
    )
  );

  // Create Transactions for Users
  const transactions = await Promise.all(
    users.flatMap((user) =>
      Array.from({ length: 5 }, () => {
        const category =
          categories[Math.floor(Math.random() * categories.length)];
        return prisma.transaction.create({
          data: {
            userId: user.id,
            amount: Math.floor(Math.random() * 1000) + 100,
            type: ["INCOME", "EXPENSE"][Math.floor(Math.random() * 2)],
            categoryId: category.id,
            date: new Date(),
          },
        });
      })
    )
  );

  // Create Audit Logs
  const actions = ["CREATE", "UPDATE", "DELETE"];
  await Promise.all(
    users.flatMap((user) =>
      Array.from({ length: 3 }, () =>
        prisma.auditLog.create({
          data: {
            userId: user.id,
            action: actions[Math.floor(Math.random() * actions.length)],
            entityType: ["User", "Budget", "Transaction"][
              Math.floor(Math.random() * 3)
            ],
            entityId: Math.random().toString(36).substr(2, 10),
            timestamp: new Date(),
            ipAddress: "192.168.1.1",
            userAgent: "Mozilla/5.0",
          },
        })
      )
    )
  );

  console.log("✅ Database seeding completed with 10-20 records per entity!");
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
