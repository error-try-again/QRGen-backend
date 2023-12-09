import { PhoneRequest } from '../ts/interfaces/qr-code-request-interfaces';
import { ErrorType } from '../ts/enums/error-enum';

export function formatPhone(data: PhoneRequest) {
  try {
    return `tel:${data.phone}`;
  } catch {
    throw new Error(ErrorType.INVALID_PHONE_DATA);
  }
}
