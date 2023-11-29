import {ProcessedQRData} from '../ts/interfaces/helper-interfaces.ts';
import {AllRequests} from '../ts/types/all-request-types.ts';
import {generateQR} from '../services/qr-code-services.ts';
import {handleDataTypeSwitching} from '../utils/handle-data-type-switching.ts';
import {ErrorType} from '../ts/enums/error-enum.ts';
import {
    BatchQRDataParameters,
    SingleQRDataParameters
} from '../ts/interfaces/qr-data-paramaters-interfaces.ts';
import {
    DEFAULT_MARGIN,
    DEFAULT_QR_PRECISION,
    DEFAULT_QR_SIZE
} from "../config.ts";

export const processSingleQRCode = async ({
                                              qrData: {
                                                  type,
                                                  customData,
                                                  margin,
                                                  size,
                                                  precision
                                              }
                                          }: SingleQRDataParameters): Promise<ProcessedQRData<AllRequests>> => {

    let updatedData;
    let updatedMargin = margin;
    let updatedSize = size;
    let updatedPrecision = precision;

    const checkInitialData = () => {
        if (!type || !customData) {
            throw new Error(ErrorType.MISSING_CUSTOM_DATA);
        }
        return;
    };

    const handleUnsetValues = () => {
        if (!margin) {
            updatedMargin = DEFAULT_MARGIN;
        }
        if (!size) {
            updatedSize = DEFAULT_QR_SIZE;
        }
        if (!precision) {
            updatedPrecision = DEFAULT_QR_PRECISION;
        }
    };

    checkInitialData();
    handleUnsetValues();

    try {
        updatedData = handleDataTypeSwitching(type, customData);
    } catch {
        throw new Error(ErrorType.INVALID_TYPE);
    }

    if (updatedPrecision && updatedSize && updatedData) {
        const qrCodeData = await generateQR({
            data: updatedData,
            margin: updatedMargin,
            size: updatedSize,
            precision: updatedPrecision
        });

        return {type, customData, size, precision, qrCodeData};

    } else {
        throw new Error(ErrorType.MISSING_CUSTOM_DATA);
    }
};

// Process a batch of QR codes in parallel
export const generateQRCodesForBatch = async ({
                                                  qrData
                                              }: BatchQRDataParameters): Promise<ProcessedQRData<AllRequests>[]> => {
    return Promise.all(
        qrData.map(element => processSingleQRCode({qrData: element}))
    );
};
