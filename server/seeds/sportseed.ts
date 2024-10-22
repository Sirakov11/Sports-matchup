import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("sports").del();

    // Inserts seed entries
    await knex("sports").insert([
        { id: 1, name: "wrestling" },
        { id: 2, name: "tennis" },
        { id: 3, name: "table tennis" }
    ]);
};
