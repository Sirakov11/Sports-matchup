import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable('users')
		.addColumn('sport_id', 'integer')
		.execute();
	await db.schema
		.alterTable('users')
		.addForeignKeyConstraint(
			'users_sport_id_fkey',
			['sport_id'],
			'sports',
			['id']
		)
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable('users')
		.dropConstraint('users_sport_id_fkey')
		.execute()
	await db.schema
		.alterTable('users')
		.dropColumn('sport_id')
		.execute();
}