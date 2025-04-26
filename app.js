import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import verifyToken from './middlewares/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use(verifyToken); // 🔒 全局拦截中间件

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the Task Management API');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
