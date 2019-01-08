import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorsHandler } from './error.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorsHandler, multi: true },
];
