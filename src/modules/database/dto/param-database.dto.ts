import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { DatabasesConstant } from '../constant/database.constant';

export class DatabaseParamDto {
  @IsIn(DatabasesConstant.COLLECTIONS_NAME)
  @ApiProperty({
    enum: DatabasesConstant.COLLECTIONS_NAME,
  })
  collectionName: string;
}
