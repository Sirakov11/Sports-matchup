import { Kysely } from "kysely";
import { DB } from "kysely-codegen";

export async function seed(db: Kysely<DB>) {
  await db.deleteFrom("sports").execute();

  await db
    .insertInto("sports")
    .values([
      { name: "wrestling" },
      { name: "tennis" },
      { name: "table tennis" },
    ])
    .execute();
}
