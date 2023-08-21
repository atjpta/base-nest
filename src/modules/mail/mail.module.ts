import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AppConfig } from 'src/configs/app.config';
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        // transport: config.get('MAIL_TRANSPORT'),
        transport: {
          host: AppConfig.getInstance().mail.host,
          secure: false,
          auth: {
            user: AppConfig.getInstance().mail.user,
            pass: AppConfig.getInstance().mail.password,
          },
        },
        defaults: {
          from: `"No Reply" <${AppConfig.getInstance().mail.from}>`,
        },
        template: {
          dir: join(__dirname, '..', '../../src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
