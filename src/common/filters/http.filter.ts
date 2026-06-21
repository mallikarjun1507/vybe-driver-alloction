import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch()
export class GlobalFilter
  implements ExceptionFilter {

  catch(
    exception: any,
    host: ArgumentsHost,
  ) {

    const response =
      host
        .switchToHttp()
        .getResponse();

    const request =
      host
        .switchToHttp()
        .getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : 500;

    response.status(status).json({

      success: false,

      statusCode: status,

      timestamp:
        new Date().toISOString(),

      path: request.url,

      message:
        exception.message ||
        'Internal Server Error',
    });
  }
}