import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class ValidateMongoId implements PipeTransform<any, string> {
  transform(value: any): string {
    if (!isMongoId(value)) {
      throw new BadRequestException(`[${value}] Invalid MongoDB ObjectId`);
    }
    return value;
  }
}
