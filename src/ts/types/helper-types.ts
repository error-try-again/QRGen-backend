import { AllRequests } from './all-request-types.ts';

export type FormatHandler<T extends AllRequests> = (data: T) => string;
