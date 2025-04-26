import { ZodError } from 'zod';

export const validate = schema => (req, res, next) => {
  try {
    // 对 req.body 校验（可以根据需要扩展校验 req.query, req.params）
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.errors.map(err => err.message).join('; ');
      return res.fail(`参数错误: ${message}`, 400);
    }
    next(error);
  }
};
