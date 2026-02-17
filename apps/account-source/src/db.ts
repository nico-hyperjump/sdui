import { PrismaClient } from "../client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

/**
 * Resolves the SQLite database URL for the account source.
 *
 * @param dbPath - Optional explicit path to the SQLite file.
 * @returns A `file:` prefixed URL suitable for the adapter.
 */
function resolveDatabaseUrl(dbPath?: string): string {
  if (dbPath) {
    return dbPath.startsWith("file:") ? dbPath : `file:${dbPath}`;
  }
  const envUrl = process.env["ACCOUNT_DATABASE_URL"] ?? "";
  if (envUrl) {
    return envUrl.startsWith("file:") ? envUrl : `file:${envUrl}`;
  }
  return `file:${path.resolve(import.meta.dirname, "..", "prisma", "dev.db")}`;
}

/**
 * Creates a Prisma client for the account source database.
 *
 * @param dbPath - Optional path to the SQLite database file.
 * @returns Configured PrismaClient instance.
 */
export function createAccountPrismaClient(dbPath?: string): PrismaClient {
  const url = resolveDatabaseUrl(dbPath);
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter, log: ["warn", "error"] });
}

/** Singleton Prisma client for the account source database. */
let accountDb: PrismaClient;

const globalForPrisma = globalThis as unknown as {
  accountDb: PrismaClient | undefined;
};

if (!globalForPrisma.accountDb) {
  globalForPrisma.accountDb = createAccountPrismaClient();
}

accountDb = globalForPrisma.accountDb;

export { accountDb };
export type { PrismaClient };
