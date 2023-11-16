import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';

export class QueryTopByDateDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    default: 1,
    description: 'day',
  })
  day?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    default: 1,
    description: 'month',
  })
  month?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    default: 2023,
    type: Number,
    description: 'year',
  })
  year?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    type: Number,
    default: 10,
    required: false,
    description: 'top',
  })
  top?: number = 10;
}

export class QueryByMonthAndMusicDto extends OmitType(QueryTopByDateDto, [
  'top',
  'day',
]) {
  @IsMongoId()
  @ApiProperty({
    description: 'music id',
  })
  music?: string;
}

export class QueryByYearAndMusicDto extends PickType(QueryTopByDateDto, [
  'year',
]) {
  @IsMongoId()
  @ApiProperty({
    description: 'music id',
  })
  music?: string;
}
