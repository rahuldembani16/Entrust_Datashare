import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/connection.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

function publicUser(user) {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db('users').where({ email }).first();

  if (!user || !(await bcrypt.compare(password || '', user.password_hash))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  await db('audit_log').insert({ user_id: user.id, action: 'login', target_table: 'users', target_id: user.id });
  return res.json({ token: signToken(user), user: publicUser(user) });
});

router.post('/register', async (req, res) => {
  const { email, password, name, role = 'farmer', region_id } = req.body;

  if (!email || !password || !name || !region_id) {
    return res.status(400).json({ message: 'Email, password, name, and region are required' });
  }

  const existing = await db('users').where({ email }).first();
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const [id] = await db('users').insert({ email, password_hash, name, role, region_id });
  const user = await db('users').where({ id }).first();
  return res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await db('users').where({ id: req.user.id }).first();
  return res.json({ user: publicUser(user) });
});

router.put('/profile', requireAuth, async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Name is required' });
  }

  await db('users').where({ id: req.user.id }).update({ name: name.trim() });
  const user = await db('users').where({ id: req.user.id }).first();
  await db('audit_log').insert({ user_id: req.user.id, action: 'update_profile', target_table: 'users', target_id: req.user.id });
  return res.json({ user: publicUser(user) });
});

export default router;
