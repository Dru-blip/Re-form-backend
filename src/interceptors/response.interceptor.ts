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
  /**
   * @summary
   * This interceptor is responsible for transforming the response
   * into a standardized API response format.
   *
   * @param context - The context of the request.
   * @param next - The next handler in the chain.
   *
   * @returns An observable that emits a standardized API response.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<APIResponse<any>> {
    return next
      .handle()
      .pipe(map((res) => this.transformResponse(res, context)));
  }

  /**
   * @summary
   * This method takes a response and an execution context
   * and returns a standardized API response.
   *
   * @param res - The response to be transformed.
   * @param ctx - The execution context.
   *
   * @returns A standardized API response.
   */
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
