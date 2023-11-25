import { ProcessedQRData } from '../ts/interfaces/helper-interfaces.ts';
import { AllRequests } from '../ts/types/all-request-types.ts';
import { generateQR } from '../services/qr-code-services.ts';
import { DEFAULT_QR_SIZE } from '../config.ts';
import { handleDataTypeSwitching } from '../utils/handle-data-type-switching.ts';
import { ErrorType } from '../ts/enums/error-enum.ts';
import {
  BatchQRDataParameters,
  SingleQRDataParameters
} from '../ts/interfaces/qr-data-paramaters-interfaces.ts';

export const processSingleQRCode = async ({
  qrData: { type, customData, size = DEFAULT_QR_SIZE, precision = 'M' }
}: SingleQRDataParameters): Promise<ProcessedQRData<AllRequests>> => {
  if (!type || !customData) {
    throw new Error(ErrorType.MISSING_CUSTOM_DATA);
  }

  let updatedData;
  try {
    updatedData = handleDataTypeSwitching(type, customData);
  } catch {
    throw new Error(ErrorType.INVALID_TYPE);
  }

  const qrCodeData = await generateQR({
    data: updatedData,
    size,
    precision
  });

  return { type, customData, size, precision, qrCodeData };
};

// Process a batch of QR codes in parallel
export const generateQRCodesForBatch = async ({
  qrData
}: BatchQRDataParameters): Promise<ProcessedQRData<AllRequests>[]> => {
  return Promise.all(
    qrData.map(element => processSingleQRCode({ qrData: element }))
  );
};
