import {
    GoogleReviewRequest
} from "../ts/interfaces/qr-code-request-interfaces.ts";

export function formatGoogleReview(data: GoogleReviewRequest) {
    return `https://search.google.com/local/writereview?placeid=${data.placeId}`;
}
