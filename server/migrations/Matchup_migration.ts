import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("matchups")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("liker", "integer", (col) => col.notNull().references("users.id"))
    .addColumn("liked", "integer", (col) => col.notNull().references("users.id"))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("matchups")
    .dropColumn("liker")
    .dropColumn("liked")
    .execute();
}
