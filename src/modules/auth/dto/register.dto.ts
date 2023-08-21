import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @ApiProperty({
    example: 'aa',
    description: 'The username of the user',
  })
  username: string;

  @IsString()
  @ApiProperty({
    example: 'fullName',
    description: 'The fullName of the user',
  })
  fullName: string;

  @IsString()
  @IsEmail()
  @ApiProperty({
    example: 'aa@gmail.com',
    description: 'The email of the user',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: 'aa',
    description: 'The password of the user',
  })
  password: string;
}
