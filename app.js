import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import verifyToken from './middlewares/auth.js';
import { logger } from './utils/logger.js';
import { responseWrapper } from './middlewares/responseWrapper.js';

import { createRateLimiter } from './utils/tools.js';

// 1. Initialize express app
const app = express();

// 2. CORS whitelist setup (must come before routes)
const whitelist = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite dev
  'https://your-frontend-domain.com' // production frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

const defaultLimiter = createRateLimiter(
  15 * 60 * 1000,
  100,
  '请求过于频繁，请稍后再试。'
);

app.use(cors(corsOptions));
app.use(defaultLimiter);

// 3. Logging setup with morgan
const today = format(new Date(), 'yyyy-MM-dd');
const logDirectory = path.join('logs', today);
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory, { recursive: true });

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

// 4. Global middlewares
app.use(express.json());                // Parse JSON body
app.use(responseWrapper);              // Unified response wrapper
app.use(verifyToken);                  // 🔒 Token validation middleware

// 5. Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the Task Management API');
});

// 6. Global error handler (must be after all routes)
app.use((err, req, res, next) => {
  logger.error(`${err.message} | ${req.method} ${req.originalUrl} | ${req.ip}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 7. Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

