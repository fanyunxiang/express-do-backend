// utils/logger.js
import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

// 获取今天的日期作为文件夹名
const today = format(new Date(), 'yyyy-MM-dd');
const logDir = path.join('logs', today);

// 保证 logs/日期目录存在
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 单独的 transport 配置
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
    new winston.transports.Console()
  ]
});
