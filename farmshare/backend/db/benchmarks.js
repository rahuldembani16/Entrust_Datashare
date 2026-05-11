import db from './connection.js';

export async function refreshBenchmark(region_id, crop_id, season) {
  const aggregate = await db('farm_records')
    .where({ region_id, crop_id, season })
    .avg({ avg_yield: 'yield_kg_ha', avg_cost: 'input_cost', avg_water: 'water_use' })
    .count({ sample_size: 'id' })
    .first();

  if (!aggregate || Number(aggregate.sample_size) === 0) return;

  const row = {
    region_id,
    crop_id,
    season,
    avg_yield: Number(Number(aggregate.avg_yield).toFixed(1)),
    avg_cost: Number(Number(aggregate.avg_cost).toFixed(1)),
    avg_water: Number(Number(aggregate.avg_water).toFixed(1)),
    sample_size: Number(aggregate.sample_size)
  };

  const existing = await db('regional_benchmarks').where({ region_id, crop_id, season }).first();
  if (existing) {
    await db('regional_benchmarks').where({ region_id, crop_id, season }).update(row);
  } else {
    await db('regional_benchmarks').insert(row);
  }
}
