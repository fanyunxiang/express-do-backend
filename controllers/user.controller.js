import { pool } from '../db/index.js';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
    console.log('注册请求:', req.body);
    
  if (!name || !email || !password) {
    return res.status(400).json({ error: '字段不能为空' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: '邮箱已被注册' });
    }

    const id = nanoid();
    console.log('生成的用户 ID:', id);
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
      [id, name, email, hashedPassword]
    );

    // 创建 JWT token
    const token = jwt.sign(
      { id, name, email },             // payload
      JWT_SECRET,                      // 密钥
      { expiresIn: '7d' }              // token 有效期
    );

    res.status(201).json({
      message: '注册成功',
      user: { id, name, email },
      token
    });
  } catch (err) {
    console.error('注册错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
};
