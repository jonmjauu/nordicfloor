import { db } from "../lib/db/client";
import { categories, products } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const categorySeed = [
    {
      name: "Premium",
      slug: "premium",
      description: "Eksklusive dekorer med ekstra slitestyrke"
    },
    {
      name: "Fiskebensmønster",
      slug: "fiskebensmonster",
      description: "Chevron- og fiskebensgulv med karakter"
    },
    {
      name: "Stein & Betong",
      slug: "stein-betong",
      description: "Moderne uttrykk inspirert av naturstein og sement"
    },
    {
      name: "Tredesign",
      slug: "tredesign",
      description: "Klassiske plankedekorer med realistisk struktur"
    },
    {
      name: "Budsjettvennlig",
      slug: "budsjettvennlig",
      description: "Prisgunstige alternativer uten å ofre kvalitet"
    }
  ];

  const categoryMap = new Map<string, number>();

  for (const item of categorySeed) {
    const existing = await db.query.categories.findFirst({ where: eq(categories.slug, item.slug) });

    if (existing) {
      categoryMap.set(item.slug, existing.id);
      continue;
    }

    const [inserted] = await db.insert(categories).values(item).returning();
    categoryMap.set(item.slug, inserted.id);
  }

  const productSeed = [
    {
      name: "Johannes Oak",
      slug: "johannes-oak",
      categorySlug: "premium",
      description: "Varm eiketone med naturlig struktur og ekstra robust overflate.",
      price: 231,
      dimensions: "1220 x 181 x 5 mm",
      sqmPerPackage: "2.21",
      stock: 260,
      images: ["https://images.unsplash.com/photo-1600566752227-8f3f1f0caef8?auto=format&fit=crop&w=1200&q=80"],
      featured: true,
      active: true
    },
    {
      name: "Bergen Chevron",
      slug: "bergen-chevron",
      categorySlug: "fiskebensmonster",
      description: "Chevron-inspirert design for et sofistikert og tidløst uttrykk.",
      price: 279,
      dimensions: "630 x 126 x 6 mm",
      sqmPerPackage: "1.59",
      stock: 120,
      images: ["https://images.unsplash.com/photo-1616627455730-8e5f20f7af79?auto=format&fit=crop&w=1200&q=80"],
      featured: true,
      active: true
    },
    {
      name: "Oslo Concrete",
      slug: "oslo-concrete",
      categorySlug: "stein-betong",
      description: "Lys betonglook med minimalistisk overflate og moderne preg.",
      price: 214,
      dimensions: "914 x 457 x 5 mm",
      sqmPerPackage: "2.51",
      stock: 180,
      images: ["https://images.unsplash.com/photo-1617098451612-85d4d4d0f8f0?auto=format&fit=crop&w=1200&q=80"],
      featured: true,
      active: true
    },
    {
      name: "Lofoten Pine",
      slug: "lofoten-pine",
      categorySlug: "tredesign",
      description: "Lys nordisk furudekor med dempet åring og matt finish.",
      price: 198,
      dimensions: "1218 x 178 x 4.5 mm",
      sqmPerPackage: "2.17",
      stock: 220,
      images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"],
      featured: false,
      active: true
    },
    {
      name: "Nordlys Ash",
      slug: "nordlys-ash",
      categorySlug: "budsjettvennlig",
      description: "Slitesterk askedekor med god pris og enkel klikkmontering.",
      price: 184,
      dimensions: "1220 x 180 x 4 mm",
      sqmPerPackage: "2.20",
      stock: 340,
      images: ["https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80"],
      featured: false,
      active: true
    },
    {
      name: "Trondheim Walnut",
      slug: "trondheim-walnut",
      categorySlug: "premium",
      description: "Dyp valnøttfarge med elegant struktur og høy slitestyrke.",
      price: 249,
      dimensions: "1524 x 228 x 6 mm",
      sqmPerPackage: "2.78",
      stock: 90,
      images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"],
      featured: true,
      active: true
    },
    {
      name: "Fjord Herringbone",
      slug: "fjord-herringbone",
      categorySlug: "fiskebensmonster",
      description: "Klassisk fiskebensmønster i naturlig eiketone.",
      price: 268,
      dimensions: "610 x 122 x 5 mm",
      sqmPerPackage: "1.49",
      stock: 140,
      images: ["https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1200&q=80"],
      featured: false,
      active: true
    },
    {
      name: "Arctic Stone",
      slug: "arctic-stone",
      categorySlug: "stein-betong",
      description: "Stein-inspirert dekor med kjølige gråtoner.",
      price: 205,
      dimensions: "914 x 457 x 4.5 mm",
      sqmPerPackage: "2.50",
      stock: 160,
      images: ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"],
      featured: false,
      active: true
    }
  ];

  for (const item of productSeed) {
    const existing = await db.query.products.findFirst({ where: eq(products.slug, item.slug) });
    if (existing) {
      continue;
    }

    await db.insert(products).values({
      name: item.name,
      slug: item.slug,
      categoryId: categoryMap.get(item.categorySlug)!,
      description: item.description,
      price: item.price,
      dimensions: item.dimensions,
      sqmPerPackage: item.sqmPerPackage,
      stock: item.stock,
      images: item.images,
      featured: item.featured,
      active: item.active
    });
  }

  console.log("Seed complete");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
