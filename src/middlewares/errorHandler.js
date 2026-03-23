const logger = require('../utils/logger');
const { AppError, ConfigValidationError } = require('../utils/errors');

function errorHandler(err, req, res, next) {
  // 记录错误日志
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // 判断是否为自定义错误
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        timestamp: err.timestamp
      }
    });
  }

  // 配置验证错误特殊处理
  if (err instanceof ConfigValidationError) {
    return res.status(400).json({
      error: {
        code: 'CONFIG_VALIDATION_ERROR',
        message: '配置验证失败',
        details: {
          errors: err.errors.map(e => ({
            path: e.path,
            message: e.message,
            suggestion: getSuggestion(e)
          }))
        },
        timestamp: new Date().toISOString()
      }
    });
  }

  // 未知错误
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: '服务器内部错误',
      timestamp: new Date().toISOString()
    }
  });
}

// 获取错误提示建议
function getSuggestion(error) {
  const { path, message, params } = error;

  if (message.includes('required')) {
    return `缺少必填字段: ${path}`;
  }
  if (message.includes('pattern')) {
    return `格式不匹配，请参考配置Schema中的pattern规则`;
  }
  if (message.includes('enum')) {
    return `值不在允许的枚举范围内: ${JSON.stringify(params.allowedValues)}`;
  }
  if (message.includes('minimum') || message.includes('maximum')) {
    return `值范围错误: ${JSON.stringify(params)}`;
  }

  return '请检查配置文件格式和内容';
}

// 异步错误捕获包装器
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = errorHandler;
module.exports.asyncHandler = asyncHandler;
