import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import verifyToken from './middlewares/auth.js';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import { logger } from './utils/logger.js';
import { responseWrapper } from './middlewares/responseWrapper.js';

// 1. init express
const app = express();

// 2. logs setup
const today = format(new Date(), 'yyyy-MM-dd');
const logDirectory = path.join('logs', today);
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory, { recursive: true });

// 3.  morgan
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// 4. middlewares
app.use(cors());
app.use(express.json());
app.use(responseWrapper);
app.use(verifyToken); // 🔒 Token 验证中间件


// 6. routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the Task Management API');
});

// 7. listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// 8. error handling
app.use((err, req, res, next) => {
  logger.error(`${err.message} | ${req.method} ${req.originalUrl} | ${req.ip}`);
  res.status(500).json({ error: 'Internal Server Error' });
});


