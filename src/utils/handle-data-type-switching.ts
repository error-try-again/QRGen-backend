import {AllRequests, RequestTypeMap} from '../ts/types/all-request-types.ts';
import {formatters} from '../formatters/format-mapping.ts';

export const handleDataTypeSwitching = <T extends AllRequests>(
    type: string,
    data: T
): string => {
    return formatters[type as keyof RequestTypeMap](data);
};
