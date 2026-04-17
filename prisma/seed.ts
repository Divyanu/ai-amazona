import "dotenv/config";
import { hash } from "bcryptjs";
import { Pool, PoolClient } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run seed.");
}

const pool = new Pool({
  connectionString: databaseUrl,
});

type UserSeed = { name: string; email: string; role: "ADMIN" | "USER" };
type ProductSeed = {
  name: string;
  slug: string;
  image: string;
  description: string;
  price: string;
  stock: number;
};
type CategorySeed = {
  name: string;
  slug: string;
  image: string;
  description: string;
  products: ProductSeed[];
};

const users: UserSeed[] = [
  { name: "Admin User", email: "admin@amazona.dev", role: "ADMIN" },
  { name: "John Customer", email: "john@amazona.dev", role: "USER" },
  { name: "Sara Customer", email: "sara@amazona.dev", role: "USER" },
];

const catalog: CategorySeed[] = [
  {
    name: "T-shirts",
    slug: "t-shirts",
    image: "/images/category-tshirts.svg",
    description: "Comfortable everyday t-shirts for all occasions.",
    products: [
      {
        name: "Classic Cotton T-Shirt",
        slug: "classic-cotton-t-shirt",
        image: "/images/product-tshirt-classic.svg",
        description: "Soft cotton tee with regular fit and crew neck.",
        price: "24.99",
        stock: 120,
      },
      {
        name: "Oversized Graphic T-Shirt",
        slug: "oversized-graphic-t-shirt",
        image: "/images/product-tshirt-oversized.svg",
        description: "Relaxed oversized fit with premium print finish.",
        price: "29.99",
        stock: 90,
      },
    ],
  },
  {
    name: "Jeans",
    slug: "jeans",
    image: "/images/category-jeans.svg",
    description: "Modern denim styles built for comfort and durability.",
    products: [
      {
        name: "Slim Fit Stretch Jeans",
        slug: "slim-fit-stretch-jeans",
        image: "/images/product-jeans-skinny.svg",
        description: "Stretch denim with slim silhouette and all-day comfort.",
        price: "59.99",
        stock: 75,
      },
      {
        name: "Relaxed Fit Denim Jeans",
        slug: "relaxed-fit-denim-jeans",
        image: "/images/product-jeans-relaxed.svg",
        description: "Relaxed straight-leg denim for casual daily wear.",
        price: "64.99",
        stock: 60,
      },
    ],
  },
  {
    name: "Shoes",
    slug: "shoes",
    image: "/images/category-shoes.svg",
    description: "Versatile footwear for running and lifestyle.",
    products: [
      {
        name: "Daily Run Sneakers",
        slug: "daily-run-sneakers",
        image: "/images/product-shoes-running.svg",
        description: "Lightweight running sneakers with breathable mesh upper.",
        price: "89.99",
        stock: 50,
      },
      {
        name: "Urban Casual Sneakers",
        slug: "urban-casual-sneakers",
        image: "/images/product-shoes-casual.svg",
        description: "Minimal casual sneakers with cushioned footbed.",
        price: "79.99",
        stock: 70,
      },
    ],
  },
];

async function seedUsers(client: PoolClient) {
  const defaultPasswordHash = await hash("123456", 10);

  for (const user of users) {
    await client.query(
      `
      INSERT INTO "User" ("id", "name", "email", "password", "role", "createdAt", "updatedAt")
      VALUES (md5(random()::text || clock_timestamp()::text), $1, $2, $3, $4::"UserRole", NOW(), NOW())
      ON CONFLICT ("email")
      DO UPDATE SET
        "name" = EXCLUDED."name",
        "password" = EXCLUDED."password",
        "role" = EXCLUDED."role",
        "updatedAt" = NOW();
      `,
      [user.name, user.email, defaultPasswordHash, user.role],
    );
  }
}

async function seedCategoriesAndProducts(client: PoolClient) {
  for (const category of catalog) {
    const categoryResult = await client.query<{ id: string }>(
      `
      INSERT INTO "Category" ("id", "name", "slug", "image", "description", "createdAt", "updatedAt")
      VALUES (md5(random()::text || clock_timestamp()::text), $1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT ("slug")
      DO UPDATE SET
        "name" = EXCLUDED."name",
        "image" = EXCLUDED."image",
        "description" = EXCLUDED."description",
        "updatedAt" = NOW()
      RETURNING "id";
      `,
      [category.name, category.slug, category.image, category.description],
    );

    const categoryId = categoryResult.rows[0].id;

    for (const product of category.products) {
      await client.query(
        `
        INSERT INTO "Product" (
          "id", "name", "slug", "image", "description", "price", "stock",
          "isActive", "categoryId", "createdAt", "updatedAt"
        )
        VALUES (md5(random()::text || clock_timestamp()::text), $1, $2, $3, $4, $5::numeric, $6, true, $7, NOW(), NOW())
        ON CONFLICT ("slug")
        DO UPDATE SET
          "name" = EXCLUDED."name",
          "image" = EXCLUDED."image",
          "description" = EXCLUDED."description",
          "price" = EXCLUDED."price",
          "stock" = EXCLUDED."stock",
          "isActive" = EXCLUDED."isActive",
          "categoryId" = EXCLUDED."categoryId",
          "updatedAt" = NOW();
        `,
        [
          product.name,
          product.slug,
          product.image,
          product.description,
          product.price,
          product.stock,
          categoryId,
        ],
      );
    }
  }
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await seedUsers(client);
    await seedCategoriesAndProducts(client);
    await client.query("COMMIT");
    console.log("Seed completed successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
