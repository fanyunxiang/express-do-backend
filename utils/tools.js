import rateLimit from 'express-rate-limit';

/**
 * Create a reusable rate limiter middleware
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} max - Max number of requests per IP in the window
 * @param {string} msg - Message to return on limit exceeded
 * @returns rateLimit middleware
 */
export const createRateLimiter = (windowMs, max, msg) =>
  rateLimit({
    windowMs,
    max,
    message: { code: 429, msg }
  });
