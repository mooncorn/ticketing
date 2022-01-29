import { SerializedError } from '../interfaces/errors';
import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Route not found');
  }

  serializeErrors() {
    return [{ message: 'Route not found' }];
  }
}
