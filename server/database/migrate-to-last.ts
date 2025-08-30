import * as path from "path";
import { promises as fs } from "fs";
import SQLite from "better-sqlite3";
import { Kysely, Migrator, FileMigrationProvider, SqliteDialect } from "kysely";
import { DATABASE_PATH } from "./db";

export async function migrateToLatest() {
  const db = new Kysely({
    dialect: new SqliteDialect({
      database: new SQLite(DATABASE_PATH),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}
