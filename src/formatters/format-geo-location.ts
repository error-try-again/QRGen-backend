import { GeoLocationRequest } from '../ts/interfaces/qr-code-request-interfaces';
import { ErrorType } from '../ts/enums/error-enum';

export function formatGeoLocation(data: GeoLocationRequest) {
  try {
    return `geo:${data.latitude},${data.longitude}`;
  } catch {
    throw new Error(ErrorType.INVALID_GEO_LOCATION_DATA);
  }
}
