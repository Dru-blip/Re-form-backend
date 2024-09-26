import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { format } from 'date-fns';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';

export interface APIResponse<T> {
  statusCode: number;
  path: string;
  message: string;
  data: T;
  timestamp: string;
}

export class ResponseInterceptor<T>
  implements NestInterceptor<T, APIResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<APIResponse<any>> {
    return next
      .handle()
      .pipe(map((res) => this.transformResponse(res, context)));
  }

  transformResponse(res: any, ctx: ExecutionContext): APIResponse<any> {
    const http = ctx.switchToHttp();
    const request: Request = http.getRequest();
    const response: Response = http.getResponse();
    return {
      statusCode: response.statusCode,
      path: request.path,
      message: 'success',
      data: res,
      timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
    };
  }
}
