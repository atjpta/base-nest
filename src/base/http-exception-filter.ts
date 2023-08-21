import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { IStatus } from './response';

export interface IExceptionResponse {
  message: string;
  status: IStatus;
}
@Catch(HttpException)
export class BaseHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const customStatus = (exception.getResponse() as IExceptionResponse).status;
    const message = exception.message;
    const responseError = exception.getResponse();
    const error = [];
    if (
      typeof responseError === 'object' &&
      responseError.hasOwnProperty('message')
    ) {
      const errorMessage = responseError['message'];
      if (typeof errorMessage === 'object') {
        error.push(...errorMessage);
      } else {
        error.push(errorMessage);
      }
    } else if (typeof responseError === 'string') {
      error.push(responseError);
    } else {
      error.push(exception.name);
    }

    return response.status(200).json({
      status: customStatus || {
        code: exception.getStatus(),
        description: message,
      },
      message,
      timestamp: new Date().toISOString(),
      data: [],
      error,
    });
  }
}
