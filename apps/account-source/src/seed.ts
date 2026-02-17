import { createAccountPrismaClient } from "./db";

/**
 * Seeds the account source database with demo user accounts.
 */
async function main() {
  const db = createAccountPrismaClient();

  console.log("Seeding account source database...");

  await db.userAccount.deleteMany();

  await db.userAccount.createMany({
    data: [
      {
        userId: "user-1",
        name: "Andi Pratama",
        phoneNumber: "+62812345678",
        planName: "Internet 50GB",
        planType: "prepaid",
        dataLimitGb: 50,
        dataUsedGb: 23.5,
        balance: 45000,
        currency: "IDR",
        brand: "brand_a",
      },
      {
        userId: "user-2",
        name: "Siti Rahayu",
        phoneNumber: "+62898765432",
        planName: "Unlimited Plan",
        planType: "postpaid",
        dataLimitGb: 999,
        dataUsedGb: 87.2,
        balance: 0,
        currency: "IDR",
        billDate: "15th",
        brand: "brand_a",
      },
      {
        userId: "user-3",
        name: "Budi Santoso",
        phoneNumber: "+62811223344",
        planName: "Business Pro",
        planType: "business",
        dataLimitGb: 200,
        dataUsedGb: 45.0,
        balance: 150000,
        currency: "IDR",
        billDate: "1st",
        brand: "brand_a",
      },
      {
        userId: "user-4",
        name: "Dewi Lestari",
        phoneNumber: "+62877654321",
        planName: "Data Boost 25GB",
        planType: "prepaid",
        dataLimitGb: 25,
        dataUsedGb: 12.8,
        balance: 25000,
        currency: "IDR",
        brand: "brand_b",
      },
      {
        userId: "user-5",
        name: "Demo User",
        phoneNumber: "+62800000000",
        planName: "Showcase Unlimited",
        planType: "postpaid",
        dataLimitGb: 100,
        dataUsedGb: 42.7,
        balance: 85000,
        currency: "IDR",
        billDate: "1st",
        brand: "brand_demo",
      },
    ],
  });

  console.log("Account source database seeded successfully.");
}

main().catch(console.error);
