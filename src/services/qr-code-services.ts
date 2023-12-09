import QRCode from 'qrcode';
import { DEFAULT_QR_SIZE } from '../config';
import { GenerateQRParameters } from '../ts/interfaces/qr-data-paramaters-interfaces';

export const generateQR = async ({
                                   colors,
                                   data,
                                   margin,
                                   size,
                                   precision
                                 }: GenerateQRParameters): Promise<string> => {
  let parsedSize = Number(size);

  if (Number.isNaN(parsedSize) || parsedSize < 50 || parsedSize > 1000) {
    parsedSize = DEFAULT_QR_SIZE;
  }

  return QRCode.toDataURL(data, {
    color: {
      dark: colors.dark || '#000000',
      light: colors.light || '#ffffff'
    },
    errorCorrectionLevel: precision,
    margin: margin,
    type: 'image/png',
    width: parsedSize
  });
};
