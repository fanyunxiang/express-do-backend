import express from 'express';
import { registerUser } from '../controllers/user.controller.js';
const router = express.Router();

router.post('/register', registerUser);

router.get('/', (req, res) => {
  res.send('user list');
});

module.exports = router;
