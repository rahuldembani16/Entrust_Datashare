import express from 'express';
import db from '../db/connection.js';

const router = express.Router();

router.get('/regions', async (req, res) => {
  return res.json(await db('regions').orderBy('name'));
});

router.get('/crops', async (req, res) => {
  return res.json(await db('crops').orderBy('category').orderBy('name'));
});

export default router;
