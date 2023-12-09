import { TextRequest } from '../ts/interfaces/qr-code-request-interfaces';
import { ErrorType } from '../ts/enums/error-enum';

export function formatText(data: TextRequest) {
  try {
    return data.text ?? '';
  } catch {
    throw new Error(ErrorType.INVALID_TEXT_DATA);
  }
}
