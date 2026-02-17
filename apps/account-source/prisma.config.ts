import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

const dbUrl =
  process.env["ACCOUNT_DATABASE_URL"] ??
  `file:${path.resolve(import.meta.dirname, "prisma", "dev.db")}`;

export default defineConfig({
  datasource: {
    url: dbUrl,
  },
});
