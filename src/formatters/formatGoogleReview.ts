import { GoogleReviewRequest } from '../ts/interfaces/qr-code-request-interfaces';
import { ErrorType } from '../ts/enums/error-enum';

export function formatGoogleReview(data: GoogleReviewRequest) {
  try {
    return `https://search.google.com/local/writereview?placeid=${data.placeId}`;
  } catch {
    throw new Error(ErrorType.INVALID_GOOGLE_REVIEW_DATA);
  }
}
