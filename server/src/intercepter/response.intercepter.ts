import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

// Response by routes 
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, { data: T }> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ data: T }> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}

// Error thrown by routes 
@Injectable()
export class ErrorsResponseInterceptor<T>
  implements NestInterceptor<T, { error: any }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ error: any }> {
    return next.handle().pipe(
      catchError((err) =>
        throwError(
          new BadGatewayException({
            error: {
              message: err.message || 'Internal server error',
              statusCode: err.status || 500,
            },
          }),
        ),
      ),
    );
  }
}
// error thrown by guards
export class GuardErrorResponse extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.UNAUTHORIZED,
  ) {
    super({ error: { message, statusCode } }, statusCode);
  }
}
