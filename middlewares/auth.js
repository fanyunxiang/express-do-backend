import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Bearer xxx...

  // 不验证注册/登录接口
  if (['/register', '/login'].some(path => req.path.includes(path))) {
    return next(); // 不验证注册/登录接口
  }
  
  if (!token) {
    return res.status(401).json({ error: '未提供 token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // 放行
  } catch (err) {
    return res.status(403).json({ error: 'token 无效或已过期' });
  }
};

module.exports = verifyToken;
