import express from 'express';
import db from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:regionId/:cropId', requireAuth, async (req, res) => {
  const { regionId, cropId } = req.params;
  const benchmarks = await db('regional_benchmarks')
    .where({ region_id: regionId, crop_id: cropId })
    .orderBy('season', 'asc');

  const latest = benchmarks[benchmarks.length - 1] || null;
  return res.json({ latest, trend: benchmarks });
});

router.get('/', requireAuth, async (req, res) => {
  const { region_id, crop_id, season } = req.query;
  const stakeholderByRole = {
    researcher: 'researcher',
    service_provider: 'service_provider',
    government: 'government'
  };

  if (stakeholderByRole[req.user.role]) {
    const query = db('farm_records')
      .join('sharing_permissions', function joinSharing() {
        this.on('farm_records.farmer_id', '=', 'sharing_permissions.farmer_id')
          .andOn('sharing_permissions.stakeholder_type', '=', db.raw('?', [stakeholderByRole[req.user.role]]))
          .andOn('sharing_permissions.is_active', '=', db.raw('?', [1]));
      })
      .join('regions', 'farm_records.region_id', 'regions.id')
      .join('crops', 'farm_records.crop_id', 'crops.id')
      .select('farm_records.region_id', 'farm_records.crop_id', 'farm_records.season', 'regions.name as region_name', 'crops.name as crop_name', 'crops.category')
      .avg({ avg_yield: 'farm_records.yield_kg_ha', avg_cost: 'farm_records.input_cost', avg_water: 'farm_records.water_use' })
      .count({ sample_size: 'farm_records.id' })
      .groupBy('farm_records.region_id', 'farm_records.crop_id', 'farm_records.season');

    if (region_id) query.where('farm_records.region_id', region_id);
    if (crop_id) query.where('farm_records.crop_id', crop_id);
    if (season) query.where('farm_records.season', season);

    const rows = await query.orderBy('farm_records.season', 'desc');
    return res.json(rows.map((row) => ({
      ...row,
      avg_yield: Number(Number(row.avg_yield).toFixed(1)),
      avg_cost: Number(Number(row.avg_cost).toFixed(1)),
      avg_water: Number(Number(row.avg_water).toFixed(1)),
      sample_size: Number(row.sample_size)
    })));
  }

  const query = db('regional_benchmarks')
    .join('regions', 'regional_benchmarks.region_id', 'regions.id')
    .join('crops', 'regional_benchmarks.crop_id', 'crops.id')
    .select('regional_benchmarks.*', 'regions.name as region_name', 'crops.name as crop_name', 'crops.category');

  if (region_id) query.where('regional_benchmarks.region_id', region_id);
  if (crop_id) query.where('regional_benchmarks.crop_id', crop_id);
  if (season) query.where('season', season);

  return res.json(await query.orderBy('season', 'desc'));
});

export default router;
