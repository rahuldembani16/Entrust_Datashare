import express from 'express';
import db from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const rows = await db('case_studies')
    .leftJoin('regions', 'case_studies.region_id', 'regions.id')
    .leftJoin('crops', 'case_studies.crop_id', 'crops.id')
    .select('case_studies.*', 'regions.name as region_name', 'crops.name as crop_name')
    .orderBy('case_studies.id', 'desc');
  return res.json(rows);
});

router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const [id] = await db('case_studies').insert(req.body);
  const row = await db('case_studies').where({ id }).first();
  return res.status(201).json(row);
});

export default router;
