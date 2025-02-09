import { Kysely } from 'kysely';
import { sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('users')
        .addColumn('experience', 'text')
        .addColumn('weight', 'integer')
        .addColumn('height', 'integer')
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('users')
        .dropColumn('experience')
        .dropColumn('weight')
        .dropColumn('height')
        .execute();
}
