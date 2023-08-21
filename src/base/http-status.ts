import { IStatus } from './response';

export class BaseHttpStatus {
  // Client success
  static OK: IStatus = {
    code: 200,
    description: 'Query success',
  };
  static CREATED: IStatus = {
    code: 201,
    description: 'Create success',
  };
  static UPDATE: IStatus = {
    code: 200,
    description: 'Update success',
  };
  static DELETE: IStatus = {
    code: 200,
    description: 'Delete success',
  };

  // Client exception
  static BAB_REQUEST: IStatus = {
    code: 400,
    description: 'Bad request',
  };
  static UNAUTHORIZED: IStatus = {
    code: 401,
    description: 'Unauthorized',
  };
  static FORBIDDEN: IStatus = {
    code: 403,
    description: 'Forbidden',
  };
  static NO_FOUND: IStatus = {
    code: 404,
    description: 'Not found',
  };
  static NOT_ACCEPT: IStatus = {
    code: 406,
    description: 'Not acceptable',
  };
  static CONFLICT: IStatus = {
    code: 409,
    description: 'Conflict',
  };
  static UNPROCESSABLE_ENTITY: IStatus = {
    code: 422,
    description: 'Unprocessable entity',
  };

  // Server exception
  static SERVER_ERROR: IStatus = {
    code: 500,
    description: 'Server error',
  };
}
