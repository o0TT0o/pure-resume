// 自定义错误类型
class AppError extends Error {
  constructor(message, code, statusCode, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

// 配置错误
class ConfigError extends AppError {
  constructor(message, details = {}) {
    super(message, 'CONFIG_ERROR', 500, details);
  }
}

// 配置验证错误
class ConfigValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 'CONFIG_VALIDATION_ERROR', 400, { errors });
  }
}

// 验证错误
class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

// 文件操作错误
class FileError extends AppError {
  constructor(message, details = {}) {
    super(message, 'FILE_ERROR', 500, details);
  }
}

// i18n 错误
class I18nError extends AppError {
  constructor(message, details = {}) {
    super(message, 'I18N_ERROR', 500, details);
  }
}

module.exports = {
  AppError,
  ConfigError,
  ConfigValidationError,
  ValidationError,
  FileError,
  I18nError
};
