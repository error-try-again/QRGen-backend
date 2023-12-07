import {QRData} from './helper-interfaces.ts';
import {AllRequests} from '../types/all-request-types.ts';
import {QRCodeErrorCorrectionLevel} from 'qrcode';

export interface SingleQRDataParameters {
    qrData: QRData<AllRequests>;
}

export interface BatchQRDataParameters {
    qrData: QRData<AllRequests>[];
}

export interface QRGenericData<T extends AllRequests> {
    qrData: QRData<T>;
}

export interface QRGenericDataArray<T extends AllRequests> {
    qrData: QRData<T>[];
}

export interface GenerateQRParameters {
    colors: {
        dark: string;
        light: string;
    };
    data: string;
    margin?: number;
    size: string | number;
    precision: QRCodeErrorCorrectionLevel;
}
