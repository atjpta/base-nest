import { INestApplication } from '@nestjs/common';

export const corsOption = {
  origin: true, // allows all origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // allowed headers
  credentials: true, // enables sending cookies over CORS
};

// const whitelist = ['https://website.com', 'https://www.website.com'];

export const enableMyCors = (app: INestApplication) => {
  app.enableCors(corsOption);
};
