import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { AppConfig } from './configs/app.config';
import * as AppMiddleware from './middleware';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  AppMiddleware.enableMyCors(app);
  // AppMiddleware.enableMyHelmet(app);
  // AppMiddleware.enableMyMorgan(app);
  AppMiddleware.enableMySwagger(app);
  //
  const PORT = AppConfig.getInstance().app.port || 3600;

  await app.listen(PORT, async () => {
    const url = await app.getUrl();
    AppConfig.urlServer = url;
    console.log(`Application is running, see document on: ${url}/docs`);
  });
}
bootstrap();
