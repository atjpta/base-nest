import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { APP_MODULES } from '../../modules';
import { SwaggerTheme } from 'swagger-themes';
import { AppConfig } from 'src/configs/app.config';

export const SWAGGER_API_ROOT = 'docs';
export const SWAGGER_API_NAME = 'Simple Nest API';
export const SWAGGER_API_DESCRIPTION = 'Simple API Description';
export const SWAGGER_API_CURRENT_VERSION = '1.0';
export const SWAGGER_API_TITLE = 'API Documentation';
export const SWAGGER_API_CONTACT: [string, string, string] = [
  'author',
  'github-link',
  'email',
];

export const enableMySwagger = (app: INestApplication) => {
  const configs = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .setTitle(SWAGGER_API_TITLE)
    .addBearerAuth()
    .setContact(...SWAGGER_API_CONTACT)
    .build();

  console.log();

  const theme = new SwaggerTheme('v3');
  // More config: https://www.npmjs.com/package/swagger-themes

  let options: SwaggerCustomOptions;
  if (AppConfig.getInstance().app.product == 'dev') {
    ///. in run local
    options = {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        defaultModelsExpandDepth: -1,
        showCommonExtensions: true,
        showExtensions: true,
        deepLinking: true,
        filter: true,
        displayOperationId: false,
        defaultModelRendering: 'model',
        docExpansion: 'none',
        displayOperationDuration: true,
      },
      customCss: theme.getBuffer('dark'),
    };
  } else {
    options = {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        defaultModelsExpandDepth: -1,
        showCommonExtensions: true,
        showExtensions: true,
        deepLinking: true,
        filter: true,
        displayOperationId: false,
        defaultModelRendering: 'model',
        docExpansion: 'none',
        displayOperationDuration: true,
      },
      // Thêm liên kết CDN cho Swagger UI
      customCss: theme.getBuffer('dark'),
      customSiteTitle: 'API Documentation',
      // Đặt các liên kết CDN của Swagger tại đây
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.52.2/swagger-ui.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.52.2/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.52.2/swagger-ui-standalone-preset.js',
      ],
    };
  }

  const document: OpenAPIObject = SwaggerModule.createDocument(app, configs, {
    include: [...APP_MODULES],
  });

  SwaggerModule.setup(SWAGGER_API_ROOT, app, document, options);
};
