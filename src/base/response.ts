import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseHttpStatus } from './http-status';
import { AppMixin } from 'src/shared/utils/app-mixin';

export interface IStatus {
  code: number;
  description: string;
}
export interface IHttpSuccess {
  status: IStatus;
  message: string;
  data?: any[];
  error?: any[];
}

export interface IBaseDataResponse {
  statusCode: IStatus;
  object: string;
  data?: any;
  message?: string;
  error?: any;
}

export enum IMethod {
  POST = 'POST',
  GET = 'GET',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
  PATCH = 'PATCH',
}
export class BaseResponse {
  static success(iBaseDataResponse: IBaseDataResponse): IHttpSuccess {
    const objectUpperCase = iBaseDataResponse.object?.toUpperCase();

    const resData = AppMixin.toArray(iBaseDataResponse.data);
    const resError = AppMixin.toArray(iBaseDataResponse.error);
    if (!resData[0]) {
      iBaseDataResponse.statusCode = BaseHttpStatus.NO_FOUND;
      resError.push(
        `[${objectUpperCase}]: ${BaseHttpStatus.NO_FOUND.description}`,
      );
    }
    if (resData[0] == 1) {
      resData.length = 0;
    }
    switch (iBaseDataResponse.statusCode) {
      case BaseHttpStatus.CREATED: {
        return {
          status: iBaseDataResponse.statusCode,
          message:
            iBaseDataResponse.message ??
            `[${objectUpperCase}]: Create successfully!`,
          data: resData,
          error: resError,
        };
      }
      case BaseHttpStatus.UPDATE: {
        return {
          status: iBaseDataResponse.statusCode,
          message:
            iBaseDataResponse.message ??
            `[${objectUpperCase}]: Update successfully!`,
          data: resData,
          error: resError,
        };
      }
      case BaseHttpStatus.DELETE: {
        return {
          status: iBaseDataResponse.statusCode,
          message:
            iBaseDataResponse.message ??
            `[${objectUpperCase}]: Delete successfully!`,
          data: resData,
          error: resError,
        };
      }
      default: {
        return {
          status: iBaseDataResponse.statusCode,
          message:
            iBaseDataResponse.message ??
            `[${objectUpperCase}]: Query successfully!`,
          data: resData,
          error: resError,
        };
      }
    }
  }

  static forbidden(object: string, message?: string): HttpException {
    const objectUpperCase = object.toUpperCase();
    throw new ForbiddenException({
      message: message ?? `[${objectUpperCase}]: Not have role!`,
      status: BaseHttpStatus.FORBIDDEN,
    });
  }
  static unauthorized(object: string, message?: string): HttpException {
    const objectUpperCase = object.toUpperCase();
    throw new UnauthorizedException({
      message:
        message ?? `[${objectUpperCase}]: Request must sent with a token!`,
      status: BaseHttpStatus.UNAUTHORIZED,
    });
  }

  static badRequest(object: string, message?: string): HttpException {
    const objectUpperCase = object.toUpperCase();
    throw new BadRequestException({
      message: message ?? `[${objectUpperCase}]: Invalid request!`,
      status: BaseHttpStatus.BAB_REQUEST,
    });
  }

  static tokenExpired(object: string, message?: string): HttpException {
    const objectUpperCase = object.toUpperCase();
    throw new UnprocessableEntityException({
      message: message ?? `[${objectUpperCase}]: Token expired or invalid!`,
      status: BaseHttpStatus.UNPROCESSABLE_ENTITY,
    });
  }

  static notAcceptable(object: string, message?: string): HttpException {
    const objectUpperCase = object.toUpperCase();
    throw new NotAcceptableException({
      message: message ?? `[${objectUpperCase}]: Authentication failed!`,
      status: BaseHttpStatus.NOT_ACCEPT,
    });
  }

  static notFound(
    object: string,
    key?: string,
    value?: string,
    message?: string,
  ): HttpException {
    const objectUpperCase = object.toUpperCase();
    if (key || value) {
      throw new NotFoundException({
        message:
          message ??
          `[${objectUpperCase}]: Record ${key}="${value}" not found!`,
        status: BaseHttpStatus.NO_FOUND,
      });
    }
    throw new NotFoundException({
      message: message ?? `[${objectUpperCase}]: Record not found!`,
      status: BaseHttpStatus.NO_FOUND,
    });
  }

  static conflict(
    object: string,
    key?: string,
    value?: string,
    message?: string,
  ): HttpException {
    const objectUpperCase = object.toUpperCase();
    if (key || value) {
      throw new ConflictException({
        message:
          message ??
          `[${objectUpperCase}]: Record ${key}="${value}" already exist!`,
        status: BaseHttpStatus.CONFLICT,
      });
    }
    throw new ConflictException({
      message: message ?? `[${objectUpperCase}]: Record already exist`,
      status: BaseHttpStatus.CONFLICT,
    });
  }

  static serverError(object: string, message?: string): HttpException {
    const objectUpperCase = object.toUpperCase();
    throw new InternalServerErrorException({
      message: message ?? `[${objectUpperCase}]: Server is having error!`,
      status: BaseHttpStatus.SERVER_ERROR,
    });
  }
}
