import { Injectable } from '@angular/core';
import { VideoService } from './video.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CateResolverService implements Resolve<any> {

  constructor(private video: VideoService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    return this.video.getLatest(0, 20, parseInt(route.paramMap.get('id'), 10)).pipe(
      take(1),
      mergeMap(videos => {
        if (videos) {
          return of(videos);
        } else { // id not found
          return of([]);
        }
      })
    );
  }
}
