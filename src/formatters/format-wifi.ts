import { WifiRequest } from '../ts/interfaces/qr-code-request-interfaces';
import { ErrorType } from '../ts/enums/error-enum';

export function formatWiFi(data: WifiRequest) {
  try {
    return `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};H:${
      data.hidden ? 1 : 0
    };`;
  } catch {
    throw new Error(ErrorType.INVALID_WIFI_DATA);
  }
}
