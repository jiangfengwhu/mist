import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from '../message.service';
import { throwError, Observable, timer } from 'rxjs';
import {
  catchError,
  retryWhen,
  mergeMap,
} from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorsHandler implements HttpInterceptor {
  constructor(private _msg: MessageService, private _route: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      retryWhen(genericRetryStrategy({
        scalingDuration: 2000,
        retryStatusCodes: [503, 504]
      })),
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 502:
            this._msg.openBar('后端已离线');
            break;
          case 401:
            this._msg.openBar('请先登录');
            this._route.navigate(['/user/login']);
            break;
          case (504 || 503):
            this._msg.openBar('连接超时');
            break;
          case 404:
            this._msg.openBar('不存在的页面', {
              duration: 2000
            });
            break;
        }
        return throwError(error);
      })
    );
  }
}

const genericRetryStrategy = ({
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  retryStatusCodes = []
}: {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  retryStatusCodes?: number[];
} = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      if (retryAttempt <= maxRetryAttempts && retryStatusCodes.find(e => e === error.status)) {
        return timer(retryAttempt * scalingDuration);
      }
      return throwError(error);
    }),
  );
};
