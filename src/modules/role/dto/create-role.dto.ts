import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @ApiProperty({
    example: 'role',
    description: 'name role in system',
  })
  name: string;
}
