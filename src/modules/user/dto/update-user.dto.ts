import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends CreateUserDto {}
export class UpdatePasswordDto extends PickType(CreateUserDto, ['password']) {
  @IsString()
  @ApiProperty({
    example: 'user2',
    description: 'new password of user',
  })
  password: string;
  @IsString()
  @ApiProperty({
    example: 'user22',
    description: 'new password of user',
  })
  newPassword: string;
}
