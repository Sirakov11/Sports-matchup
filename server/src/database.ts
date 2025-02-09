import { Kysely, PostgresDialect } from "kysely";
import { DB } from "kysely-codegen";
import pg from "pg";

export const db = new Kysely<DB>({
  log:["query"],
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      log(...messages) {
        console.log("db log", messages)
      },
    }),
  }),
});
