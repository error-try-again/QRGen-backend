import {UrlRequest} from '../ts/interfaces/qr-code-request-interfaces.ts';

export function formatURL(data: UrlRequest) {
    return data.url ?? '';
}
