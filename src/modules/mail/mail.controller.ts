import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MailConstant } from './constant/mail.constant';
import { MailService } from './mail.service';

@ApiBearerAuth()
@ApiTags(MailConstant.SWAGGER_TAG)
@Controller({ path: MailConstant.API_PREFIX })
export class MailController {
  constructor(private readonly mailService: MailService) {}
}
