import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

/**
 * https://github.com/helmetjs/helmet#how-it-works
 */

export const enableMyHelmet = (app: INestApplication) => {
  app.use(helmet());
};
