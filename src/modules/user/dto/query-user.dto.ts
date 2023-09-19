import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { QueryFindAll } from 'src/base/query-dto';

export class QueryForgetAccount {
  @IsString()
  @ApiProperty({
    example: 'aa',
    description: 'username account',
  })
  username: string;

  @IsEmail()
  @ApiProperty({
    example: 'caoducan351@gmail.com',
    description: 'email account',
  })
  email: string;
}

export class QueryFindAllUser extends QueryFindAll {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'aa',
    description: 'username account',
  })
  key?: string;
}
