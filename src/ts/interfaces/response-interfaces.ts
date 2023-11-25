import { ErrorType } from '../enums/error-enum.ts';
import { Response } from 'express';

export interface ResponseInterfaces {
  errorType: ErrorType;
  message?: string;
  response: Response;
  statusCode?: number;
}
