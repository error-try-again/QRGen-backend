import { CryptoRequest } from '../ts/interfaces/qr-code-request-interfaces.ts';

export function formatCrypto(data: CryptoRequest) {
  return `${data.address}?amount=${data.amount ?? ''}`;
}
