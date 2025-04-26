import express from 'express';
import { registerUser } from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.js';
import { userRegisterSchema } from '../validators/user.validator.js';
import { createRateLimiter } from '../utils/tools.js';

const loginLimiter = createRateLimiter(
  60 * 1000,
  5,
  '登录尝试过多，请稍后再试。'
);

const router = express.Router();

router.post('/register', validate(userRegisterSchema), registerUser);

// router.post('/login', loginLimiter, loginUser);

router.get('/', (req, res) => {
  res.send('user list');
});

export default router;
