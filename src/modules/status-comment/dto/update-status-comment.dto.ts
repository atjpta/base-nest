import { PartialType } from '@nestjs/swagger';
import { CreateStatusCommentDto } from './create-status-comment.dto';

export class UpdateStatusCommentDto extends PartialType(
  CreateStatusCommentDto,
) {}
