import express from 'express';
import db from '../db/connection.js';
import { refreshBenchmark } from '../db/benchmarks.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';

const router = express.Router();

router.use(requireAuth, requireRole('farmer'));

router.get('/records', async (req, res) => {
  const records = await db('farm_records')
    .join('crops', 'farm_records.crop_id', 'crops.id')
    .join('regions', 'farm_records.region_id', 'regions.id')
    .where('farm_records.farmer_id', req.user.id)
    .select('farm_records.*', 'crops.name as crop_name', 'regions.name as region_name')
    .orderBy('farm_records.created_at', 'desc');
  return res.json(records);
});

router.get('/records/shared', async (req, res) => {
  const records = await db('farm_records')
    .join('crops', 'farm_records.crop_id', 'crops.id')
    .join('regions', 'farm_records.region_id', 'regions.id')
    .where('farm_records.farmer_id', req.user.id)
    .select('farm_records.*', 'crops.name as crop_name', 'regions.name as region_name')
    .orderBy('farm_records.created_at', 'desc');

  const recordIds = records.map((r) => r.id);
  const sharingRows = recordIds.length
    ? await db('record_sharing').whereIn('record_id', recordIds)
    : [];

  const result = records.map((record) => ({
    ...record,
    shared_with: sharingRows
      .filter((s) => s.record_id === record.id)
      .map((s) => s.stakeholder_type)
  }));

  return res.json(result);
});

router.post('/records', async (req, res) => {
  const { crop_id, region_id, season, yield_kg_ha, input_cost, water_use, notes, motivation, sharing } = req.body;

  if (!crop_id || !region_id || !season || !yield_kg_ha || !input_cost || !water_use) {
    return res.status(400).json({ message: 'Crop, region, season, yield, cost, and water use are required' });
  }

  const [id] = await db('farm_records').insert({
    farmer_id: req.user.id,
    crop_id,
    region_id,
    season,
    yield_kg_ha,
    input_cost,
    water_use,
    notes
  });

  if (motivation) {
    await db('data_upload_motivations').insert({ farmer_id: req.user.id, record_id: id, motivation });
  }

  // Save per-record sharing selections and update global sharing permissions
  const validTypes = ['farmer_org', 'researcher', 'service_provider', 'government'];
  if (sharing && typeof sharing === 'object') {
    for (const type of validTypes) {
      if (type in sharing && Boolean(sharing[type])) {
        await db('record_sharing').insert({ record_id: id, farmer_id: req.user.id, stakeholder_type: type });
        // Also enable global sharing permission for this type
        const existing = await db('sharing_permissions').where({ farmer_id: req.user.id, stakeholder_type: type }).first();
        const values = { is_active: true, agreed_at: new Date().toISOString() };
        if (existing) {
          await db('sharing_permissions').where({ id: existing.id }).update(values);
        } else {
          await db('sharing_permissions').insert({ farmer_id: req.user.id, stakeholder_type: type, ...values });
        }
      }
    }
  }

  await refreshBenchmark(region_id, crop_id, season);

  await db('audit_log').insert({ user_id: req.user.id, action: 'create_record', target_table: 'farm_records', target_id: id });
  const record = await db('farm_records').where({ id }).first();
  return res.status(201).json(record);
});

router.delete('/records/:id', async (req, res) => {
  const deleted = await db('farm_records').where({ id: req.params.id, farmer_id: req.user.id }).delete();
  if (!deleted) return res.status(404).json({ message: 'Record not found' });
  await db('audit_log').insert({ user_id: req.user.id, action: 'delete_record', target_table: 'farm_records', target_id: req.params.id });
  return res.status(204).send();
});

export default router;
