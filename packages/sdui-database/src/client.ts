import { PrismaClient } from "../client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

/**
 * Resolves the SQLite database URL from the given path, environment
 * variable, or a default location.
 *
 * @param dbPath - Optional explicit path to the SQLite file.
 * @returns A `file:` prefixed URL suitable for the adapter.
 */
function resolveDatabaseUrl(dbPath?: string): string {
  if (dbPath) {
    return dbPath.startsWith("file:") ? dbPath : `file:${dbPath}`;
  }

  const envUrl = process.env["SDUI_DATABASE_URL"] ?? "";
  if (envUrl) {
    return envUrl.startsWith("file:") ? envUrl : `file:${envUrl}`;
  }

  return `file:${path.resolve(import.meta.dirname, "..", "prisma", "dev.db")}`;
}

/**
 * Creates a new Prisma client for the SDUI database backed by SQLite.
 *
 * To swap to PostgreSQL:
 * 1. Change the Prisma schema `provider` to `"postgresql"`
 * 2. Replace this adapter with `@prisma/adapter-pg`
 * 3. Pass a PostgreSQL connection string instead of a file path
 *
 * @param dbPath - Path to the SQLite database file. Defaults to the
 *   `SDUI_DATABASE_URL` environment variable or `prisma/dev.db`.
 * @returns A configured PrismaClient instance.
 */
export function createSduiPrismaClient(dbPath?: string): PrismaClient {
  const url = resolveDatabaseUrl(dbPath);
  const adapter = new PrismaBetterSqlite3({ url });

  return new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });
}

/** Singleton Prisma client for the SDUI database, cached on `globalThis`. */
let sduiPrismaClient: PrismaClient;

const globalForPrisma = globalThis as unknown as {
  sduiPrismaClient: PrismaClient | undefined;
};

if (!globalForPrisma.sduiPrismaClient) {
  globalForPrisma.sduiPrismaClient = createSduiPrismaClient();
}

sduiPrismaClient = globalForPrisma.sduiPrismaClient;

export { sduiPrismaClient };
