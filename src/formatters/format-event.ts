import { EventRequest } from '../ts/interfaces/qr-code-request-interfaces';
import { formatDatetime } from './format-date-time';
import { ErrorType } from '../ts/enums/error-enum';

export const formatEvent = (data: EventRequest): string => {
  try {
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${data.venue}`,
      `DTSTART:${formatDatetime(data.startTime!)}`, //! is used to tell TS that startTime is not null or undefined
      `DTEND:${formatDatetime(data.endTime!)}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
  } catch {
    throw new Error(ErrorType.INVALID_EVENT_DATA);
  }

};
