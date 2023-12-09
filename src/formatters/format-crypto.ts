import { CryptoRequest } from '../ts/interfaces/qr-code-request-interfaces';
import { ErrorType } from '../ts/enums/error-enum';

export function formatCrypto(data: CryptoRequest) {
  try {
    return `${data.address}?amount=${data.amount ?? ''}`;
  } catch {
    throw new Error(ErrorType.INVALID_CRYPTO_DATA);
  }
}
