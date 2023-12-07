import {ErrorType} from "../ts/enums/error-enum.ts";

export const formatDatetime = (date: string) => {
    try {
        const isoDate = new Date(date).toISOString();
        return isoDate.split(/[:-]/g).join('').split('.')[0];
    } catch (error) {
        throw new Error(ErrorType.INVALID_DATE_OR_TIME);
    }
};
