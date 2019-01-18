import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { RequestCacheService } from '../request-cache.service';
import { tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
const cacheUrls = ['/api/getVideo', '/api/getCircles', '/api/user', '/api/videoall', '/api/commall', '/api/getcomments'];
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!isCachable(req)) {
      if (req.method === ('POST' || 'PUT' || 'DELETE')) {
        this.cache.emptyCache();
      }
      return next.handle(req);
    }

    const cachedResponse = this.cache.get(req);
    return cachedResponse ?
      of(cachedResponse) : sendRequest(req, next, this.cache);
  }
}
function isCachable(req: HttpRequest<any>) {
  if (req.method === 'GET') {
    for (let i = 0; i < cacheUrls.length; ++i) {
      if (req.url.indexOf(cacheUrls[i]) > -1) {
        return true;
      }
    }
  }
  return false;
}
function sendRequest(
  req: HttpRequest<any>,
  next: HttpHandler,
  cache: RequestCacheService): Observable<HttpEvent<any>> {

  // No headers allowed in npm search request
  const noHeaderReq = req.clone({ headers: new HttpHeaders() });

  return next.handle(noHeaderReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.put(req, event); // Update the cache.
      }
    })
  );
}
