import { defineConfig } from "kysely-ctl";
import { db as kysely } from "./src/database.js";

export default defineConfig({
  kysely,
  migrations: {
    migrationFolder: "migrations",
  },
  seeds: {
    seedFolder: "seeds",
  },
});
