import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('users')
        .addColumn('phone_number', 'varchar')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('users')
        .dropColumn('phone_number')
        .execute()
}