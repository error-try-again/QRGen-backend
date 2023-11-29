import {
    CryptoRequest,
    EmailRequest,
    EventRequest,
    GeoLocationRequest, GoogleReviewRequest,
    MeCardRequest,
    PhoneRequest,
    SMSRequest,
    TextRequest,
    UrlRequest,
    VCardRequest,
    WifiRequest,
    ZoomRequest
} from '../interfaces/qr-code-request-interfaces.ts';

export type AllRequests =
    | TextRequest
    | UrlRequest
    | EmailRequest
    | PhoneRequest
    | SMSRequest
    | GeoLocationRequest
    | WifiRequest
    | EventRequest
    | CryptoRequest
    | VCardRequest
    | MeCardRequest
    | ZoomRequest
    | GoogleReviewRequest;

export type RequestTypeMap = {
    Crypto: CryptoRequest;
    Email: EmailRequest;
    Event: EventRequest;
    GeoLocation: GeoLocationRequest;
    GoogleReview: GoogleReviewRequest;
    MeCard: MeCardRequest;
    Phone: PhoneRequest;
    SMS: SMSRequest;
    Text: TextRequest;
    Url: UrlRequest;
    VCard: VCardRequest;
    WiFi: WifiRequest;
    Zoom: ZoomRequest;
};
