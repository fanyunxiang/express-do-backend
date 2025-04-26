import { pool } from '../db/index.js';
import { logger } from '../utils/logger.js';

/**
 * 包裹一段事务逻辑，自动处理连接、提交、回滚、释放
 * Wrap a piece of transaction logic and automatically handle connection, commit, rollback and release.
 * @param {function} callback async 函数，入参为 conn
 */
export async function withTransaction(callback) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    logger.error('Transaction failed and has been rolled back:' + error.message);
    throw error;
  } finally {
    conn.release(); //  leave the connection to the pool
  }
}
