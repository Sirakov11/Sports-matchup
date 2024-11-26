import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("sports", (table)=>{
        table.increments("id");
        table.string("name");
        table.timestamps(true, true);

    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("sports")
}
