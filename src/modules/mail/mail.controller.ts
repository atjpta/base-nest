import { Controller } from '@nestjs/common';
import { MailConstant } from './constant/mail.constant';
import { MailService } from './mail.service';

@Controller({ path: MailConstant.API_PREFIX })
export class MailController {
  constructor(private readonly _modelService: MailService) {}
}
