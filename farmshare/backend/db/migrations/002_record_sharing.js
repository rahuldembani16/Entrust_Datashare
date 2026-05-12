export async function up(knex) {
  await knex.schema.createTable('record_sharing', (table) => {
    table.increments('id').primary();
    table.integer('record_id').notNullable().references('id').inTable('farm_records').onDelete('CASCADE');
    table.integer('farmer_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('stakeholder_type').notNullable();
    table.timestamp('shared_at').defaultTo(knex.fn.now());
    table.unique(['record_id', 'stakeholder_type']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('record_sharing');
}
