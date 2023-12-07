import {NextFunction, Request, Response} from 'express';
import {ErrorType} from '../ts/enums/error-enum.ts';
import {validateBatchQRData, validateQRData} from './data-validation-helper.ts';

export function errorHandlingMapping(error: Error, response: Response, next: NextFunction): void {
    if (response.headersSent) {
        console.error('Headers already sent. Passing error to next middleware:', error);
        return next(error); // Pass to default error handler
    }

    const errorMappings: Record<string, number> = {
        [ErrorType.MISSING_REQUEST_TYPE]: 400,
        [ErrorType.INVALID_TYPE]: 400,
        [ErrorType.INVALID_DATE_OR_TIME]: 400,
        [ErrorType.INVALID_CRYPTO_DATA]: 400,
        [ErrorType.MISSING_DATA_BODY]: 400,
        [ErrorType.MISSING_CUSTOM_DATA]: 400,
        [ErrorType.BATCH_MISSING_DATA_BODY]: 400,
        [ErrorType.BATCH_MISSING_CUSTOM_DATA]: 400,
        [ErrorType.DUPLICATE_QR_CODES]: 409,
        [ErrorType.EXCEEDS_MAX_LIMIT]: 413,
        [ErrorType.ERROR_SETTING_HEADERS]: 500,
        [ErrorType.ERROR_APPENDING_FILES]: 500,
        [ErrorType.ERROR_FINALIZING_ARCHIVE]: 500,
        [ErrorType.UNKNOWN_ARCHIVE_ERROR]: 500,
        [ErrorType.GENERIC_ERROR]: 500
    };

    const errorType = Object.values(ErrorType).find(type => error.message.includes(type)) || ErrorType.GENERIC_ERROR;
    const statusCode = errorMappings[errorType] || 500;

    if (statusCode === 500) {
        console.error('Server Error:', error);
    }

    response.status(statusCode).json({
        error: {
            type: errorType,
            message: error.message,
            status: statusCode,
            // Uncomment for stack trace
            // details: error.stack
        }
    });
}

export const validateRequest = async ({body}: Request, response: Response, next: NextFunction) => {
    try {
        validateQRData(body);
    } catch (error) {
        if (error instanceof Error) {
            errorHandlingMapping(error, response, next);
        } else {
            next(error);
        }
    }
};

export const validateBatchRequest = async (request: Request, response: Response, next: NextFunction) => {
    try {
        validateBatchQRData({qrData: request.body.qrCodes});
        next();
    } catch (error) {
        if (error instanceof Error) {
            errorHandlingMapping(error, response, next);
        } else {
            next(error);
        }
    }
};

export const asyncErrorHandler = (handler: (request: Request, response: Response, next: NextFunction) => Promise<void>) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        await handler(request, response, next);
    } catch (error) {
        if (error instanceof Error) {
            errorHandlingMapping(error, response, next);
        } else {
            next(error); // For non-Error type exceptions
        }
    }
};
