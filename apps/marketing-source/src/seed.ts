import { createMarketingPrismaClient } from "./db";

/**
 * Seeds the marketing source database with demo offers and banners.
 */
async function main() {
  const db = createMarketingPrismaClient();

  console.log("Seeding marketing source database...");

  // Clear existing data
  await db.offer.deleteMany();
  await db.banner.deleteMany();

  // Offers for brand_a
  await db.offer.createMany({
    data: [
      {
        title: "Internet 50GB",
        description: "50GB high-speed data for 30 days",
        price: "Rp 99.000",
        badge: "Popular",
        brand: "brand_a",
        segment: "prepaid",
        sortOrder: 0,
      },
      {
        title: "Internet 100GB",
        description: "100GB high-speed data for 30 days",
        price: "Rp 149.000",
        badge: "Best Value",
        brand: "brand_a",
        segment: "prepaid",
        sortOrder: 1,
      },
      {
        title: "Unlimited Plan",
        description: "Unlimited data, calls, and SMS",
        price: "Rp 199.000",
        badge: "Unlimited",
        brand: "brand_a",
        segment: "postpaid",
        sortOrder: 0,
      },
      {
        title: "Family Plan",
        description: "4 lines with 50GB shared data",
        price: "Rp 299.000",
        brand: "brand_a",
        segment: "postpaid",
        sortOrder: 1,
      },
      {
        title: "Business Pro",
        description: "Priority support, 200GB data",
        price: "Rp 499.000",
        badge: "Business",
        brand: "brand_a",
        segment: "business",
        sortOrder: 0,
      },
    ],
  });

  // Offers for brand_b
  await db.offer.createMany({
    data: [
      {
        title: "Data Boost 25GB",
        description: "25GB extra data add-on",
        price: "Rp 59.000",
        badge: "Hot Deal",
        brand: "brand_b",
        segment: "prepaid",
        sortOrder: 0,
      },
      {
        title: "Weekend Pass",
        description: "Unlimited weekend data",
        price: "Rp 39.000",
        brand: "brand_b",
        segment: "prepaid",
        sortOrder: 1,
      },
    ],
  });

  // Offers for brand_demo
  await db.offer.createMany({
    data: [
      {
        title: "Showcase Starter 10GB",
        description: "10GB high-speed data — demo plan",
        price: "Rp 49.000",
        badge: "Demo",
        brand: "brand_demo",
        segment: "prepaid",
        sortOrder: 0,
      },
      {
        title: "Showcase Unlimited",
        description: "Unlimited data, calls, and SMS — demo plan",
        price: "Rp 149.000",
        badge: "Popular",
        brand: "brand_demo",
        segment: "prepaid",
        sortOrder: 1,
      },
      {
        title: "Showcase Family 50GB",
        description: "50GB shared data for up to 4 lines — demo plan",
        price: "Rp 249.000",
        badge: "Best Value",
        brand: "brand_demo",
        segment: "postpaid",
        sortOrder: 2,
      },
    ],
  });

  // Banners for brand_a
  await db.banner.createMany({
    data: [
      {
        title: "Summer Sale!",
        subtitle: "Get 50% off all data plans this week",
        imageUrl: "https://picsum.photos/seed/banner1/800/400",
        action: JSON.stringify({ type: "navigate", screen: "plans" }),
        brand: "brand_a",
        sortOrder: 0,
      },
      {
        title: "Refer a Friend",
        subtitle: "Earn Rp 50.000 for every referral",
        imageUrl: "https://picsum.photos/seed/banner2/800/400",
        action: JSON.stringify({ type: "navigate", screen: "referral" }),
        brand: "brand_a",
        sortOrder: 1,
      },
    ],
  });

  // Banners for brand_demo
  await db.banner.createMany({
    data: [
      {
        title: "Component Showcase",
        subtitle: "Explore all 53 SDUI components in one app",
        imageUrl: "https://picsum.photos/seed/demobanner1/800/400",
        action: JSON.stringify({ type: "navigate", screen: "plans" }),
        brand: "brand_demo",
        sortOrder: 0,
      },
    ],
  });

  console.log("Marketing source database seeded successfully.");
}

main().catch(console.error);
