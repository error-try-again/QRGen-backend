import { ZoomRequest } from '../ts/interfaces/qr-code-request-interfaces';
import { ErrorType } from '../ts/enums/error-enum';

export function formatZoom(data: ZoomRequest) {
  try {
    return `https://zoom.us/j/${data.zoomId}?pwd=${data.zoomPass}`;
  } catch {
    throw new Error(ErrorType.INVALID_ZOOM_DATA);
  }
}
