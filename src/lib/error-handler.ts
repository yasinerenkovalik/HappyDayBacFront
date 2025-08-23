import { ERROR_MESSAGES } from './constants';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, status: number = 500, code: string = 'INTERNAL_ERROR', isOperational: boolean = true) {
    super(message);
    this.status = status;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleApiError = (error: any): ApiError => {
  // Network errors
  if (!navigator.onLine) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      status: 0,
      code: 'NETWORK_ERROR'
    };
  }

  // HTTP errors
  if (error.response) {
    const status = error.response.status;
    
    switch (status) {
      case 401:
        return {
          message: ERROR_MESSAGES.UNAUTHORIZED,
          status,
          code: 'UNAUTHORIZED'
        };
      case 403:
        return {
          message: ERROR_MESSAGES.FORBIDDEN,
          status,
          code: 'FORBIDDEN'
        };
      case 404:
        return {
          message: ERROR_MESSAGES.NOT_FOUND,
          status,
          code: 'NOT_FOUND'
        };
      case 422:
        return {
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          status,
          code: 'VALIDATION_ERROR'
        };
      case 500:
      default:
        return {
          message: ERROR_MESSAGES.SERVER_ERROR,
          status,
          code: 'SERVER_ERROR'
        };
    }
  }

  // Default error
  return {
    message: error.message || ERROR_MESSAGES.SERVER_ERROR,
    status: 500,
    code: 'UNKNOWN_ERROR'
  };
};

export const logError = (error: Error, context?: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'Error'}]:`, error);
  }
  
  // Production'da error tracking service'e gönder (Sentry vb.)
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error);
  // }
};