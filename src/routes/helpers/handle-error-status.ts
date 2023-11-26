import { ResponseInterfaces } from '../../ts/interfaces/response-interfaces.ts';

export const handleErrorStatus = ({
  response,
  statusCode = 500,
  errorType,
  message
}: ResponseInterfaces & { message?: string }) => {
  response.status(statusCode).json(errorType ? { errorType } : { message });
};