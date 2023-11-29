import {Request, Response} from 'express';
import {handleErrorStatus} from '../routes/helpers/handle-error-status.ts';
import {ErrorType} from '../ts/enums/error-enum.ts';
import {validateBatchQRData, validateQRData} from './data-validation-helper.ts';

export function errorHandlingMapping(error: Error, response: Response): void {
    const errorMappings: Record<string, number> = {
        [ErrorType.MISSING_REQUEST_TYPE]: 400,
        [ErrorType.INVALID_TYPE]: 400,
        [ErrorType.MISSING_DATA_BODY]: 400,
        [ErrorType.MISSING_CUSTOM_DATA]: 400,
        [ErrorType.BATCH_MISSING_DATA_BODY]: 400,
        [ErrorType.BATCH_MISSING_CUSTOM_DATA]: 400,
        [ErrorType.DUPLICATE_QR_CODES]: 409,
        [ErrorType.EXCEEDS_MAX_LIMIT]: 413,
        [ErrorType.ERROR_SETTING_HEADERS]: 500,
        [ErrorType.ERROR_APPENDING_FILES]: 500,
        [ErrorType.ERROR_FINALIZING_ARCHIVE]: 500,
        [ErrorType.UNKNOWN_ARCHIVE_ERROR]: 500
    };

    // Improved error type validation
    const errorType = Object.values(ErrorType).includes(error.message as ErrorType)
        ? (error.message as ErrorType)
        : ErrorType.GENERIC_ERROR;

    const statusCode = errorMappings[errorType] || 500;

    // Log the error for internal tracking
    if (statusCode === 500) {
        console.error('Server Error:', error);
    }

    handleErrorStatus({errorType, response, statusCode});
}

export const validateRequest = ({body}: Request, next: () => void): void => {
    if (typeof body === 'object') {
        const {type} = body;
        if (type) {
            validateQRData(body);
            next();
        } else {
            throw new Error(ErrorType.MISSING_REQUEST_TYPE);
        }
    } else {
        throw new TypeError(ErrorType.MISSING_DATA_BODY);
    }
};

export const validateBatchRequest = (
    request: Request,
    next: () => void
): void => {
    if (Array.isArray(request.body.qrCodes)) {
        validateBatchQRData({qrData: request.body.qrCodes});
        next();
    } else {
        throw new TypeError(ErrorType.MISSING_REQUEST_TYPE);
    }
};
