import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table: Knex.TableBuilder) => {
    table.increments("id").primary();         
    table.string("name").notNullable();          
    table.string("hashed_password").notNullable(); 
    table.timestamps(true, true);               
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("users"); 
}

