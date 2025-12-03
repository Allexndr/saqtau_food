import { Request, Response, NextFunction } from 'express';
import { ValidationError, NotFoundError, UnauthorizedError } from '../types';
import { logger } from '../utils/logger';

// HCI: Error Handling - Centralized error processing for consistent UX
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: any[] = [];

  // HCI: Emotional Interaction - User-friendly error messages
  if (error instanceof ValidationError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors || [];
  } else if (error instanceof NotFoundError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof UnauthorizedError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Validation error';
    errors = (error as any).errors.map((err: any) => ({
      field: err.path,
      message: err.message,
    }));
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'Duplicate entry';
    errors = (error as any).errors.map((err: any) => ({
      field: err.path,
      message: `${err.path} already exists`,
    }));
  }

  // Log error for debugging
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  // HCI: Data Gathering - Error tracking for analytics
  // In production, this would be sent to error monitoring service

  // Send response
  const response = {
    error: {
      message,
      statusCode,
      ...(errors.length > 0 && { errors }),
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  // In development, include stack trace
  if (process.env.NODE_ENV === 'development') {
    (response.error as any).stack = error.stack;
  }

  res.status(statusCode).json(response);
};
