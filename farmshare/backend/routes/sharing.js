import express from 'express';
import db from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';

const router = express.Router();
const stakeholderTypes = ['farmer_org', 'researcher', 'service_provider', 'government'];

router.use(requireAuth, requireRole('farmer'));

router.get('/permissions', async (req, res) => {
  const rows = await db('sharing_permissions').where({ farmer_id: req.user.id });
  return res.json(stakeholderTypes.map((type) => rows.find((row) => row.stakeholder_type === type) || {
    stakeholder_type: type,
    is_active: false
  }));
});

router.put('/permissions', async (req, res) => {
  const { permissions = [] } = req.body;

  for (const permission of permissions) {
    if (!stakeholderTypes.includes(permission.stakeholder_type)) continue;
    const existing = await db('sharing_permissions').where({ farmer_id: req.user.id, stakeholder_type: permission.stakeholder_type }).first();
    const values = { is_active: Boolean(permission.is_active), agreed_at: permission.is_active ? new Date().toISOString() : null };

    if (existing) {
      await db('sharing_permissions').where({ id: existing.id }).update(values);
    } else {
      await db('sharing_permissions').insert({ farmer_id: req.user.id, stakeholder_type: permission.stakeholder_type, ...values });
    }
  }

  await db('audit_log').insert({ user_id: req.user.id, action: 'update_sharing', target_table: 'sharing_permissions', target_id: req.user.id });
  const rows = await db('sharing_permissions').where({ farmer_id: req.user.id });
  return res.json(rows);
});

export default router;
