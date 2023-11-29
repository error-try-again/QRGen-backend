import {RequestTypeMap} from '../ts/types/all-request-types.ts';

import {
    CryptoRequest,
    EmailRequest,
    EventRequest,
    GeoLocationRequest,
    GoogleReviewRequest,
    MeCardRequest,
    PhoneRequest,
    SMSRequest,
    TextRequest,
    UrlRequest,
    VCardRequest,
    WifiRequest,
    ZoomRequest
} from '../ts/interfaces/qr-code-request-interfaces.ts';

export type ValidatorFunction<T> = (data: T) => boolean;

export const validators: {
    [K in keyof RequestTypeMap]: ValidatorFunction<RequestTypeMap[K]>;
} = {
    Crypto({address, cryptoType}: CryptoRequest) {
        return Boolean(cryptoType && address);
    },
    Email({email}: EmailRequest) {
        return Boolean(email);
    },
    Event({endTime, startTime, venue}: EventRequest) {
        return Boolean(venue && startTime && endTime);
    },
    GeoLocation({latitude, longitude}: GeoLocationRequest) {
        return Boolean(latitude && longitude);
    },
    GoogleReview({placeId}: GoogleReviewRequest) {
        return Boolean(placeId);
    },
    MeCard({firstName, lastName, phone1}: MeCardRequest) {
        return Boolean(firstName && lastName && phone1);
    },
    Phone(data: PhoneRequest) {
        return Boolean(data.phone);
    },
    SMS({phone, sms}: SMSRequest) {
        return Boolean(phone && sms);
    },
    Text({text}: TextRequest) {
        return Boolean(text);
    },
    Url({url}: UrlRequest) {
        return Boolean(url);
    },
    VCard({version, firstName, lastName, email, phoneWork}: VCardRequest) {
        return Boolean(version && firstName && lastName && email && phoneWork);
    },
    WiFi({encryption, ssid}: WifiRequest) {
        return Boolean(ssid && encryption);
    },
    Zoom({zoomId, zoomPass}: ZoomRequest) {
        return Boolean(zoomId && zoomPass);
    }
};
