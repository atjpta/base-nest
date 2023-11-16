import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreatePermissionDto {
  @IsMongoId()
  @ApiProperty({
    description: 'name',
  })
  name?: string;
}
