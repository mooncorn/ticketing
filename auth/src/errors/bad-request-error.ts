import { SerializedError } from '../interfaces/errors';
import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(message?: string) {
    super(message);
  }

  serializeErrors(): SerializedError[] {
    return [{ message: this.message || 'Bad request' }];
  }
}
