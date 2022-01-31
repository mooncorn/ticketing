import { SerializedError } from '../interfaces/errors';
import { CustomError } from './custom-error';

export class UnauthorizedRequestError extends CustomError {
  statusCode = 401;

  constructor(message?: string) {
    super(message);
  }

  serializeErrors(): SerializedError[] {
    return [{ message: 'Not authorized' }];
  }
}
