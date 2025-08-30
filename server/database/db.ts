import SQLite from "better-sqlite3";
import { ENV } from "config/env";
import { Kysely, SqliteDialect } from "kysely";
import { migrateToLatest } from "./migrate-to-last";
import { Database } from "./types";

export const DATABASE_PATH = `${ENV.CONFIG_DIRECTORY}/db/db.sqlite3`;

migrateToLatest();

const dialect = new SqliteDialect({
  database: new SQLite(DATABASE_PATH),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
});
