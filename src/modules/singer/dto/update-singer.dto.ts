import { PartialType } from '@nestjs/swagger';
import { CreateSingerDto } from './create-singer.dto';

export class UpdateSingerDto extends PartialType(CreateSingerDto) {}
