export function responseWrapper(req, res, next) {
  res.success = (data = null, msg = '操作成功') => {
    res.json({
      code: 200,
      msg,
      data
    });
  };

  res.fail = (msg = '请稍后再试', code = 500) => {
    res.status(code).json({
      code,
      msg
    });
  };

  next();
}
