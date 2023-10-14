import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId } from 'class-validator';
import { CommentConstant } from '../constant/comment.constant';

export class CreateCommentDto {
  @IsString()
  @ApiProperty({
    example: 'content',
    description: 'content comment',
  })
  content: string;

  @IsMongoId()
  @ApiProperty({
    description: 'avatar',
  })
  model?: string;

  @IsString()
  @ApiProperty({
    description: 'modelType',
    enum: CommentConstant.SCHEMA_MODEL_TYPE,
  })
  modelType?: string;
}
