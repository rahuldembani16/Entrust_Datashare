export async function up(knex) {
  await knex.schema.createTable('regions', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('country').notNullable();
    table.text('geojson_polygon');
  });

  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('name').notNullable();
    table.string('role').notNullable();
    table.integer('region_id').references('id').inTable('regions');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('crops', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('icon_url');
    table.string('category').notNullable();
  });

  await knex.schema.createTable('farm_records', (table) => {
    table.increments('id').primary();
    table.integer('farmer_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('crop_id').notNullable().references('id').inTable('crops');
    table.integer('region_id').notNullable().references('id').inTable('regions');
    table.string('season').notNullable();
    table.float('yield_kg_ha').notNullable();
    table.float('input_cost').notNullable();
    table.float('water_use').notNullable();
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('sharing_permissions', (table) => {
    table.increments('id').primary();
    table.integer('farmer_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('stakeholder_type').notNullable();
    table.boolean('is_active').notNullable().defaultTo(false);
    table.timestamp('agreed_at');
    table.unique(['farmer_id', 'stakeholder_type']);
  });

  await knex.schema.createTable('data_upload_motivations', (table) => {
    table.increments('id').primary();
    table.integer('farmer_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('record_id').notNullable().references('id').inTable('farm_records').onDelete('CASCADE');
    table.string('motivation').notNullable();
  });

  await knex.schema.createTable('regional_benchmarks', (table) => {
    table.integer('region_id').notNullable().references('id').inTable('regions');
    table.integer('crop_id').notNullable().references('id').inTable('crops');
    table.string('season').notNullable();
    table.float('avg_yield').notNullable();
    table.float('avg_cost').notNullable();
    table.float('avg_water').notNullable();
    table.integer('sample_size').notNullable();
    table.primary(['region_id', 'crop_id', 'season']);
  });

  await knex.schema.createTable('case_studies', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('summary').notNullable();
    table.integer('region_id').references('id').inTable('regions');
    table.integer('crop_id').references('id').inTable('crops');
    table.text('outcome_text').notNullable();
    table.string('image_url');
  });

  await knex.schema.createTable('audit_log', (table) => {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.string('action').notNullable();
    table.string('target_table').notNullable();
    table.integer('target_id');
    table.timestamp('timestamp').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('audit_log');
  await knex.schema.dropTableIfExists('case_studies');
  await knex.schema.dropTableIfExists('regional_benchmarks');
  await knex.schema.dropTableIfExists('data_upload_motivations');
  await knex.schema.dropTableIfExists('sharing_permissions');
  await knex.schema.dropTableIfExists('farm_records');
  await knex.schema.dropTableIfExists('crops');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('regions');
}
