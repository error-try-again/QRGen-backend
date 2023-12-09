import { UrlRequest } from '../ts/interfaces/qr-code-request-interfaces';
import { ErrorType } from '../ts/enums/error-enum';

export function formatURL(data: UrlRequest) {
  try {
    return data.url ?? '';
  } catch {
    throw new Error(ErrorType.INVALID_URL_DATA);
  }
}
