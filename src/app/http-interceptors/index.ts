import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorsHandler } from './error.interceptor';
import { LoggingInterceptor } from './log.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorsHandler, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
];
