import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    example: 'user',
    description: 'role of user',
  })
  role: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'id permissions',
  })
  permissions?: string[] = [];

  @IsString()
  @ApiProperty({
    example: 'user2',
    description: 'username of user',
  })
  username: string;

  @IsString()
  @ApiProperty({
    example: 'fullName',
    description: 'fullName of user',
  })
  fullName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  avatar?: string;

  @IsEmail()
  @IsString()
  @ApiProperty({
    example: 'user2@gmail.com',
    description: 'email of user',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: 'user2',
    description: 'password of user',
  })
  password: string;
}

export class createNewPassword {
  @IsString()
  @ApiProperty({
    example: 'user2',
    description: 'username of user',
  })
  username: string;

  @IsString()
  @ApiProperty({
    example: 'code',
    description: 'code rePassword',
  })
  code: string;

  @IsString()
  @ApiProperty({
    example: 'NewPassword',
    description: 'NewPassword of user',
  })
  newPassword: string;
}
