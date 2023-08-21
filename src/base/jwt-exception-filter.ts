// import { JsonWebTokenError } from 'jsonwebtoken';
// import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
// import { BaseHttpStatus } from './http-status';
// @Catch()
// export class JwtExceptionFilter implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     console.log('Catch filter');
//     console.log(exception);

//     const response = host.switchToHttp().getResponse();
//     let statusCode = BaseHttpStatus.SERVER_ERROR;
//     let message = '';
//     const error = [];
//     // switch (exception.code.toString()) {
//     //   case '11000': {
//     //     statusCode = BaseHttpStatus.CONFLICT;
//     //     message = exception.message;
//     //     error.push(exception.message);
//     //     const dataMessage = exception.keyValue;
//     //     if (dataMessage) {
//     //       error.length = 0;
//     //       error.push(
//     //         `{ ${Object.keys(dataMessage)} : ${Object.values(
//     //           dataMessage,
//     //         )} } already exist`,
//     //       );
//     //     }
//     //     break;
//     //   }
//     //   default: {
//     //     statusCode = BaseHttpStatus.SERVER_ERROR;
//     //     message = exception.message;
//     //     error.push(exception.message);
//     //     break;
//     //   }
//     // }
//     return response.status(200).json({
//       status: statusCode,
//       message,
//       timestamp: new Date().toISOString(),
//       data: [],
//       error,
//     });
//   }
// }
