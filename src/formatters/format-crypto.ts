import {CryptoRequest} from '../ts/interfaces/qr-code-request-interfaces.ts';
import {ErrorType} from "../ts/enums/error-enum.ts";

export function formatCrypto(data: CryptoRequest) {
    try {
        return `${data.address}?amount=${data.amount ?? ''}`;
    } catch (error) {
        throw new Error(ErrorType.INVALID_CRYPTO_DATA);
    }
}
