import { PartialType } from '@nestjs/swagger';
import { CreateViewDetailDto } from './create-view-detail.dto';

export class UpdateViewDetailDto extends PartialType(CreateViewDetailDto) {}
