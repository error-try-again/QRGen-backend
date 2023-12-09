import { ErrorType } from '../ts/enums/error-enum';

export const formatDatetime = (date: string) => {
  try {
    const isoDate = new Date(date).toISOString();
    return isoDate.split(/[:-]/g).join('').split('.')[0];
  } catch {
    throw new Error(ErrorType.INVALID_DATE_OR_TIME);
  }
};
