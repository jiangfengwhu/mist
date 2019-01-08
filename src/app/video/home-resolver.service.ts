import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { VideoService } from './video.service';
import { Observable, of, EMPTY } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeResolverService implements Resolve<any> {

  constructor(private video: VideoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    return this.video.getLatest(0, 12).pipe(
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
