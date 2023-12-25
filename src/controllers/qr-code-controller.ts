import { ProcessedQRData } from '../ts/interfaces/helper-interfaces';
import { AllRequests } from '../ts/types/all-request-types';
import { generateQR } from '../services/qr-code-services';
import { handleDataTypeSwitching } from '../utils/handle-data-type-switching';
import { ErrorType } from '../ts/enums/error-enum';
import {
  BatchQRDataParameters,
  SingleQRDataParameters
} from '../ts/interfaces/qr-data-paramaters-interfaces';
import { DEFAULT_MARGIN, DEFAULT_QR_PRECISION, DEFAULT_QR_SIZE } from '../config';

export const processSingleQRCode = async ({
                                            qrData: {
                                              type,
                                              customData
                                            }
                                          }: SingleQRDataParameters): Promise<ProcessedQRData<AllRequests>> => {

  // If the QR code has a custom colour, margin, size or precision, use it, otherwise use the default values
  const updatedColours = customData.colors || { dark: '#000000', light: '#ffffff' };
  const updatedMargin = customData.margin || DEFAULT_MARGIN;
  const hasSize = customData.size > 0;
  const updatedSize = hasSize ? customData.size : DEFAULT_QR_SIZE;
  const updatedPrecision = customData.precision || DEFAULT_QR_PRECISION;

  const checkInitialData = () => {
    if (!type || !customData) {
      throw new Error(ErrorType.MISSING_CUSTOM_DATA);
    }
    return;
  };

  checkInitialData();

  const updatedData = handleDataTypeSwitching(type, customData);

  if (updatedPrecision && updatedSize && updatedData && updatedMargin && updatedColours) {
    const qrData = await generateQR({
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
      qrData,
      size: updatedSize,
      type
    };

  } else {
    throw new Error(ErrorType.MISSING_CUSTOM_DATA);
  }
};

export const generateQRCodesForBatch = async ({
                                                qrData
                                              }: BatchQRDataParameters): Promise<ProcessedQRData<AllRequests>[]> => {
  return Promise.all(
    qrData.map(element => {
      return processSingleQRCode({ qrData: element });
    })
  );
};
