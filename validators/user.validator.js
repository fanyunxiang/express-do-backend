import { z } from 'zod';

export const userRegisterSchema = z.object({
  name: z.string().min(2, '用户名至少2个字符'),
  email: z.string().email('请输入正确的邮箱格式'),
  password: z.string().min(6, '密码至少6位')
});
