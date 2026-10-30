import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, isConnectedToMongo } from './config/db.js';
import bookRoutes from './routes/bookRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Initialize MongoDB Connection via MONGODB_URI in .env
  await connectDB();

  app.use(express.json());

  // Mount API endpoints
  app.use('/api/books', bookRoutes);
  app.use('/api/members', memberRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/stats', statsRoutes);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      app: 'Library Management System (MERN Stack with MongoDB)',
      mongoConnected: isConnectedToMongo,
      time: new Date().toISOString(),
    });
  });

  const isProduction = process.env.NODE_ENV === 'production';
  const rootDir = path.resolve(__dirname, '..');

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: rootDir,
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(rootDir, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Library Management System server running on http://0.0.0.0:${PORT}`);
  });

  return server;
}

startServer();
