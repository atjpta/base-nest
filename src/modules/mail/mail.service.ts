import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async welCome(mail: string, name: string) {
    this.mailerService.sendMail({
      to: mail,
      from: 'noreply@nestjs.com',
      subject: 'welcome to website',
      template: 'welcome',
      context: {
        name: name,
      },
    });
  }

  public async welComeAwait(mail: string, name: string) {
    await this.mailerService.sendMail({
      to: mail,
      from: 'noreply@nestjs.com',
      subject: 'welcome to website',
      template: 'welcome',
      context: {
        name: name,
      },
    });
  }
}
