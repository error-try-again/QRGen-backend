import { NextFunction, Request, Response } from 'express';
import { ErrorType } from '../ts/enums/error-enum';
import { validateBatchQRData, validateQRData } from './data-validation-helper';

const clientErrorStatus = 400;
const conflictErrorStatus = 409;
const exceedMaxLimitStatus = 413;
const serverErrorStatus = 500;

// Maps error types to their corresponding status codes for the response
const errorMappings: Record<string, number> = {
  ...Object.fromEntries(Object.values(ErrorType).map((type) => [type, clientErrorStatus])),
  [ErrorType.DUPLICATE_QR_CODES]: conflictErrorStatus,
  [ErrorType.ERROR_APPENDING_FILES]: serverErrorStatus,
  [ErrorType.ERROR_FINALIZING_ARCHIVE]: serverErrorStatus,
  [ErrorType.ERROR_SETTING_HEADERS]: serverErrorStatus,
  [ErrorType.EXCEEDS_MAX_LIMIT]: exceedMaxLimitStatus,
  [ErrorType.GENERIC_ERROR]: serverErrorStatus,
  [ErrorType.UNKNOWN_ARCHIVE_ERROR]: serverErrorStatus
};

export function errorHandlingMapping(error: Error, {
  headersSent,
  status
}: Response, next: NextFunction): void {
  if (headersSent) {
    console.error('Headers already sent. Passing error to next middleware:', error);
    return next(error);
  }

  // Check if the error type is in the ErrorType enum and return the corresponding key
  const errorTypeKey = Object.keys(ErrorType).find(key => {
    return ErrorType[key as keyof typeof ErrorType] === error.message;
  });

  // Check if the error type key exists, otherwise use the default error type
  const errorType = errorTypeKey || 'GENERIC_ERROR';

  // Get the status code from the error mappings, otherwise use the default client error status
  const statusCode = errorMappings[errorType as keyof typeof ErrorType] || clientErrorStatus;

  status(statusCode).json({
    error: {
      message: error.message,
      status: statusCode,
      type: errorType
      // details: error.stack
    }
  });
}

export const validateRequest = async ({ body }: Request, response: Response, next: NextFunction) => {
  try {
    validateQRData(body);
  } catch (error) {
    error instanceof Error ? errorHandlingMapping(error, response, next) : next(error);
  }
};

export const validateBatchRequest = async ({ body }: Request, response: Response, next: NextFunction) => {
  try {
    validateBatchQRData(body);
  } catch (error) {
    if (error instanceof Error) {
      errorHandlingMapping(error, response, next);
    } else {
      next(error);
    }
  }
};

export const asyncErrorHandler = (handler: (request: Request, response: Response, next: NextFunction) => Promise<void>) =>
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      await handler(request, response, next);
    } catch (error) {
      error instanceof Error ? errorHandlingMapping(error, response, next) : next(error);
    }
  };
