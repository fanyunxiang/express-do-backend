import { query } from '../db/index.js';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import { withTransaction } from '../middlewares/withTransaction.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

/**
 * getUserList
 * @param {Object} req - Express
 * @param {Object} res - Express
 * @returns {Promise<void>}
 */
export const getUserList = async (req, res) => {
  try {
    const rows = await query('SELECT * FROM users');
    res.success(rows, 'Successfully retrieved the user list.');
  } catch (err) {
    res.fail(err.message, 500);
  }
};

/**
 * registerUser
 * @param {Object} req - Express
 * @param {Object} res - Express
 * @returns {Promise<void>}
 */
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.fail('字段不能为空', 400);
  }

  try {
    const result = await withTransaction(async (conn) => {
      const [existing] = await conn.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        throw new Error('该邮箱已被注册');
      }

      const id = nanoid();
      const hashedPassword = await bcrypt.hash(password, 10);
      await conn.query(
        'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
        [id, name, email, hashedPassword]
      );

      await conn.query(
        'INSERT INTO user_logs (user_id, action) VALUES (?, ?)',
        [id, 'register']
      );

      const token = jwt.sign({ id, name, email }, process.env.JWT_SECRET, { expiresIn: '7d' });

      return { id, name, email, token };
    });

    res.success({ user: result, token: result.token }, '注册成功');
  } catch (err) {
    res.fail(err.message || '注册失败', 500);
  }
};
