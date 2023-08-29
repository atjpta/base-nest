import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { BullConstant } from '../constant/bull.constant';

@Processor(BullConstant.JOB_BULL.sendEmail)
export class EmailConsumer {
  constructor(private readonly mailerService: MailerService) {}
  @Process(BullConstant.TASK_BULL.registerMail)
  public async registerEmail(job: Job<unknown>) {
    this.mailerService.sendMail(job.data);
  }
}
