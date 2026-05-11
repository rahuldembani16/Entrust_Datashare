import express from 'express';
import db from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';

const router = express.Router();

router.use(requireAuth, requireRole('admin'));

router.get('/users', async (req, res) => {
  const users = await db('users')
    .leftJoin('regions', 'users.region_id', 'regions.id')
    .select('users.id', 'users.email', 'users.name', 'users.role', 'users.created_at', 'regions.name as region_name')
    .orderBy('users.created_at', 'desc');
  return res.json(users);
});

router.get('/records', async (req, res) => {
  const records = await db('farm_records')
    .join('users', 'farm_records.farmer_id', 'users.id')
    .join('crops', 'farm_records.crop_id', 'crops.id')
    .join('regions', 'farm_records.region_id', 'regions.id')
    .select('farm_records.*', 'users.name as farmer_name', 'crops.name as crop_name', 'regions.name as region_name')
    .orderBy('farm_records.created_at', 'desc');
  return res.json(records);
});

router.get('/audit', async (req, res) => {
  const audit = await db('audit_log')
    .leftJoin('users', 'audit_log.user_id', 'users.id')
    .select('audit_log.*', 'users.email', 'users.name')
    .orderBy('audit_log.timestamp', 'desc')
    .limit(100);
  return res.json(audit);
});

export default router;
