import { QRCodeErrorCorrectionLevel } from 'qrcode';

export interface BaseQRData {
  type: string;
  margin?: number;
  colors: {
    dark: string;
    light: string;
  };
  size: number;
  precision?: QRCodeErrorCorrectionLevel;
}

export interface QRData<
  T = {
    [key: string]: string | number | boolean | undefined;
  }
> extends BaseQRData {
  customData: T;
}

export interface ProcessedQRData<T> extends QRData<T> {
  qrData: string;
}
