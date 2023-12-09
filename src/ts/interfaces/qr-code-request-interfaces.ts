import { BaseQRData } from './helper-interfaces';

export interface UrlRequest extends BaseQRData {
  url?: string;
}

export interface TextRequest extends BaseQRData {
  text?: string;
}

export interface WifiRequest extends BaseQRData {
  encryption?: 'WEP' | 'WPA' | 'WPA2' | 'WPA3';
  hidden?: boolean;
  password?: string;
  ssid?: string;
}

export interface EmailRequest extends BaseQRData {
  bcc?: string;
  body?: string;
  cc?: string;
  email?: string;
  subject?: string;
}

export interface PhoneRequest extends BaseQRData {
  phone?: string;
}

export interface SMSRequest extends BaseQRData {
  phone?: string;
  sms?: string;
}

export interface EventRequest extends BaseQRData {
  endTime?: string;
  event?: string;
  startTime?: string;
  venue?: string;
}

export interface GeoLocationRequest extends BaseQRData {
  latitude?: string;
  longitude?: string;
}

export interface CryptoRequest extends BaseQRData {
  address?: string;
  amount?: string;
  cryptoType?: string;
}

export interface ZoomRequest extends BaseQRData {
  zoomId?: string;
  zoomPass?: string;
}

export interface VCardRequest extends BaseQRData {
  version?: string;
  city?: string;
  country?: string;
  email?: string;
  faxPrivate?: string;
  faxWork?: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  phoneMobile?: string;
  phonePrivate?: string;
  phoneWork?: string;
  position?: string;
  state?: string;
  street?: string;
  website?: string;
  zipcode?: string;
}

export interface MeCardRequest extends BaseQRData {
  birthday?: string;
  city?: string;
  country?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  notes?: string;
  phone1?: string;
  phone2?: string;
  phone3?: string;
  state?: string;
  street?: string;
  website?: string;
  zipcode?: string;
}

export interface GoogleReviewRequest extends BaseQRData {
  placeId?: string;
}
