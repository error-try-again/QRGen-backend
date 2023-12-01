import {SMSRequest} from '../ts/interfaces/qr-code-request-interfaces.ts';

export function formatSMS({phone, sms}: SMSRequest) {
    return `smsto:${phone}:${sms}`;
}
