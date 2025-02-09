/*import { Kysely } from "kysely";
import { DB } from "kysely-codegen";

export async function seed(db: Kysely<DB>) {
  await db.deleteFrom("sports").execute();
await db
  .insertInto('experience_levels')
  .values([
    { name: 'Beginner' },
    { name: 'Intermediate' },
    { name: 'Advanced' },
    { name: 'Professional' }
  ])
  .execute();
}*/