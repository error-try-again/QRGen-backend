import {ProcessedQRData} from '../ts/interfaces/helper-interfaces.ts';
import {AllRequests} from '../ts/types/all-request-types.ts';
import {generateQR} from '../services/qr-code-services.ts';
import {handleDataTypeSwitching} from '../utils/handle-data-type-switching.ts';
import {ErrorType} from '../ts/enums/error-enum.ts';
import {
    BatchQRDataParameters,
    SingleQRDataParameters
} from '../ts/interfaces/qr-data-paramaters-interfaces.ts';
import {DEFAULT_MARGIN, DEFAULT_QR_PRECISION, DEFAULT_QR_SIZE} from "../config.ts";

export const processSingleQRCode = async ({
                                              qrData: {
                                                  type,
                                                  customData,
                                              }
                                          }: SingleQRDataParameters): Promise<ProcessedQRData<AllRequests>> => {
    let updatedData;

    // If the QR code has a custom colour, margin, size or precision, use it, otherwise use the default values
    let updatedColours = customData.colors || {dark: '#000000', light: '#ffffff'};
    let updatedMargin = customData.margin || DEFAULT_MARGIN;
    let updatedSize = customData.size || DEFAULT_QR_SIZE;
    let updatedPrecision = customData.precision || DEFAULT_QR_PRECISION;

    const checkInitialData = () => {
        if (!type || !customData) {
            throw new Error(ErrorType.MISSING_CUSTOM_DATA);
        }
        return;
    };

    checkInitialData();

    updatedData = handleDataTypeSwitching(type, customData);

    if (updatedPrecision && updatedSize && updatedData) {
        const qrCodeData = await generateQR({
            colors: updatedColours,
            data: updatedData,
            margin: updatedMargin,
            precision: updatedPrecision,
            size: updatedSize
        });

        return {
            colors: updatedColours,
            customData,
            margin: updatedMargin,
            precision: updatedPrecision,
            qrCodeData,
            size: updatedSize,
            type
        };

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
