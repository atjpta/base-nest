import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isEmail, isMongoId } from 'class-validator';

@Injectable()
export class ValidateMongoId implements PipeTransform<any, string> {
  transform(value: any): string {
    if (!isMongoId(value)) {
      throw new BadRequestException(`[${value}] Invalid MongoDB ObjectId`);
    }
    return value;
  }
}

@Injectable()
export class ValidateEmail implements PipeTransform<any, string> {
  transform(value: any): string {
    if (!isEmail(value)) {
      throw new BadRequestException(`[${value}] Invalid E-mail`);
    }
    return value;
  }
}
