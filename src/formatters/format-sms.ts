import { SMSRequest } from '../ts/interfaces/qr-code-request-interfaces';
import { ErrorType } from '../ts/enums/error-enum';

export function formatSMS({ phone, sms }: SMSRequest) {
  try {
    return `smsto:${phone}:${sms}`;
  } catch {
    throw new Error(ErrorType.INVALID_SMS_DATA);
  }
}
