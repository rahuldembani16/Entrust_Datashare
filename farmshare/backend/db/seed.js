import bcrypt from 'bcryptjs';
import db from './connection.js';

const seasons = ['2022A', '2022B', '2023A', '2023B', '2024A', '2024B'];
const stakeholderTypes = ['farmer_org', 'researcher', 'service_provider', 'government'];

const polygon = (lat, lng) => JSON.stringify({
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [lng - 0.6, lat - 0.4],
      [lng + 0.6, lat - 0.4],
      [lng + 0.6, lat + 0.4],
      [lng - 0.6, lat + 0.4],
      [lng - 0.6, lat - 0.4]
    ]]
  },
  properties: {}
});

async function reset() {
  await db.migrate.rollback(undefined, true);
  await db.migrate.latest();
}

async function seed() {
  await reset();

  const regionRows = [
    ['Eastern Highlands', 'Kenya', polygon(0.5, 37.5)],
    ['Western Lowlands', 'Kenya', polygon(0.1, 34.7)],
    ['Northern Plains', 'Kenya', polygon(1.3, 36.7)],
    ['Central Valley', 'Kenya', polygon(-0.4, 36.9)],
    ['Southern Greenbelt', 'Kenya', polygon(-1.6, 37.3)],
    ['Coastal Belt', 'Kenya', polygon(-3.2, 39.6)]
  ];

  await db('regions').insert(regionRows.map(([name, country, geojson_polygon]) => ({ name, country, geojson_polygon })));

  const crops = [
    ['Wheat', '/crop-icons/wheat.svg', 'grain'],
    ['Maize', '/crop-icons/maize.svg', 'grain'],
    ['Rice', '/crop-icons/rice.svg', 'grain'],
    ['Tomatoes', '/crop-icons/tomatoes.svg', 'vegetable'],
    ['Potatoes', '/crop-icons/potatoes.svg', 'vegetable'],
    ['Beans', '/crop-icons/beans.svg', 'vegetable'],
    ['Citrus', '/crop-icons/citrus.svg', 'fruit'],
    ['Mango', '/crop-icons/mango.svg', 'fruit'],
    ['Avocado', '/crop-icons/avocado.svg', 'fruit'],
    ['Dairy Cattle', '/crop-icons/dairy.svg', 'livestock'],
    ['Goats', '/crop-icons/goats.svg', 'livestock'],
    ['Poultry', '/crop-icons/poultry.svg', 'livestock']
  ];

  await db('crops').insert(crops.map(([name, icon_url, category]) => ({ name, icon_url, category })));

  const password_hash = await bcrypt.hash('demo1234', 10);
  const users = [
    ['farmer@demo.com', 'Amina Mwangi', 'farmer', 1],
    ['researcher@demo.com', 'Dr. Daniel Otieno', 'researcher', 2],
    ['provider@demo.com', 'Grace Agronomy Services', 'service_provider', 3],
    ['govt@demo.com', 'Ministry Crop Office', 'government', 4],
    ['admin@demo.com', 'FarmShare Admin', 'admin', 1],
    ['farmer2@demo.com', 'Joseph Njoroge', 'farmer', 2],
    ['farmer3@demo.com', 'Lilian Wekesa', 'farmer', 3],
    ['farmer4@demo.com', 'Peter Kariuki', 'farmer', 4],
    ['farmer5@demo.com', 'Rose Achieng', 'farmer', 5]
  ];

  await db('users').insert(users.map(([email, name, role, region_id]) => ({ email, password_hash, name, role, region_id })));

  const farmers = await db('users').where('role', 'farmer');
  const cropRows = await db('crops');
  const records = [];

  for (let i = 0; i < 72; i += 1) {
    const farmer = farmers[i % farmers.length];
    const crop = cropRows[i % cropRows.length];
    const season = seasons[i % seasons.length];
    const baseYield = 1800 + (crop.id * 210) + ((i % 7) * 115);
    records.push({
      farmer_id: farmer.id,
      crop_id: crop.id,
      region_id: farmer.region_id,
      season,
      yield_kg_ha: baseYield,
      input_cost: 420 + (crop.id * 28) + ((i % 6) * 19),
      water_use: 120 + (crop.id * 11) + ((i % 5) * 8),
      notes: 'Simulated demo record'
    });
  }

  await db('farm_records').insert(records);

  for (const farmer of farmers) {
    await db('sharing_permissions').insert(stakeholderTypes.map((stakeholder_type, index) => ({
      farmer_id: farmer.id,
      stakeholder_type,
      is_active: index !== 2,
      agreed_at: new Date().toISOString()
    })));
  }

  const grouped = await db('farm_records')
    .select('region_id', 'crop_id', 'season')
    .avg({ avg_yield: 'yield_kg_ha', avg_cost: 'input_cost', avg_water: 'water_use' })
    .count({ sample_size: 'id' })
    .groupBy('region_id', 'crop_id', 'season');

  await db('regional_benchmarks').insert(grouped.map((row) => ({
    ...row,
    avg_yield: Number(row.avg_yield.toFixed(1)),
    avg_cost: Number(row.avg_cost.toFixed(1)),
    avg_water: Number(row.avg_water.toFixed(1)),
    sample_size: Number(row.sample_size)
  })));

  await db('case_studies').insert([
    { title: 'Maize Farmers Cut Input Waste', summary: 'Shared records helped compare fertilizer costs across valleys.', region_id: 1, crop_id: 2, outcome_text: 'Input costs fell 18% while yields stayed stable.', image_url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=70' },
    { title: 'Tomato Water Savings', summary: 'Benchmarking showed irrigation gaps in the dry season.', region_id: 4, crop_id: 4, outcome_text: 'Water use dropped 22% after schedule changes.', image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=70' },
    { title: 'Dairy Cooperative Pricing', summary: 'Aggregated production data strengthened cooperative negotiations.', region_id: 5, crop_id: 10, outcome_text: 'Farmgate prices improved by 9%.', image_url: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=900&q=70' },
    { title: 'Citrus Disease Early Warning', summary: 'Regional summaries helped identify a pest outbreak sooner.', region_id: 6, crop_id: 7, outcome_text: 'Response time improved by two weeks.', image_url: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=900&q=70' }
  ]);

  await db('audit_log').insert({ user_id: 5, action: 'seed_demo_data', target_table: 'database', target_id: null });
}

seed()
  .then(() => {
    console.log('FarmShare demo database seeded.');
    return db.destroy();
  })
  .catch(async (error) => {
    console.error(error);
    await db.destroy();
    process.exit(1);
  });
