import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateFileMongoDBDto } from 'src/base/create-dto';

export class UpdateUserDto extends CreateFileMongoDBDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'fullName of user',
  })
  fullName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'avatar of user',
  })
  avatar?: string;
}
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

export class UpdateRoleUserDto {
  @IsMongoId()
  @ApiProperty({
    example: 'mongo id role',
    description: 'update role user',
  })
  role: string;
}
