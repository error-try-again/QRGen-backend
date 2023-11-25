import { TextRequest } from '../ts/interfaces/qr-code-request-interfaces.ts';

export function formatText(data: TextRequest) {
  return data.text ?? '';
}
