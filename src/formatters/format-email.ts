import { EmailRequest } from '../ts/interfaces/qr-code-request-interfaces';
import { ErrorType } from '../ts/enums/error-enum';

export const formatEmail = (data: EmailRequest): string => {
  try {
    const mailtoString = `mailto:${data.email}?`;
    const parameters = new URLSearchParams();
    if (data.subject) {
      parameters.set('subject', data.subject);
    }
    if (data.body) {
      parameters.set('body', data.body);
    }
    if (data.cc) {
      parameters.set('cc', data.cc);
    }
    if (data.bcc) {
      parameters.set('bcc', data.bcc);
    }
    return mailtoString + parameters.toString();
  } catch {
    throw new Error(ErrorType.INVALID_EMAIL_DATA);
  }
};
