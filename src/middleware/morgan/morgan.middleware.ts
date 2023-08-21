import { INestApplication } from '@nestjs/common';
import * as morgan from 'morgan';

export enum MORGAN_MODE {
  COMBINED = 'combined',
  COMMON = 'common',
  DEV = 'dev',
  COMBINE = 'common',
  SHORT = 'short',
  TINY = 'tiny',
}

export const enableMyMorgan = (
  app: INestApplication,
  option = MORGAN_MODE.DEV,
) => {
  // app.use(morgan(option));
};
