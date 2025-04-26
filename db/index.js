import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { logger } from '../utils/logger.js'; //

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

/**
 * query
 * @param {string} sql - SQL query string
 * @param {Array} params - SQL query parameters
 * @returns {Promise<Array>} - Query result
 * @throws {Error} - Throws an error if the query fails
 * @description - Executes a SQL query and returns the result. Logs errors with SQL and parameters.
 */
export async function query(sql, params = []) {
  try {
    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (error) {
    logger.error(`DB_ERROR: ${error.message} | SQL: ${sql} | PARAMS: ${JSON.stringify(params)}`);
    throw error; // Re-throw the error to be handled by the caller
  }
}
