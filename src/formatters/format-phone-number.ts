import { PhoneRequest } from '../ts/interfaces/qr-code-request-interfaces.ts';

export function formatPhone(data: PhoneRequest) {
  return `tel:${data.phone}`;
}
