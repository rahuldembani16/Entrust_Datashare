import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import farmerRoutes from './routes/farmers.js';
import benchmarkRoutes from './routes/benchmarks.js';
import sharingRoutes from './routes/sharing.js';
import adminRoutes from './routes/admin.js';
import caseStudyRoutes from './routes/casestudies.js';
import lookupRoutes from './routes/lookups.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true, name: 'FarmShare API' }));
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/benchmarks', benchmarkRoutes);
app.use('/api/sharing', sharingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/casestudies', caseStudyRoutes);
app.use('/api', lookupRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

app.listen(port, () => {
  console.log(`FarmShare API running on http://localhost:${port}`);
});
