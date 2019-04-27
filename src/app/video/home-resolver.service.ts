import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { VideoService } from './video.service';
import { Observable, of } from 'rxjs';
import { take, mergeMap, switchMap } from 'rxjs/operators';
import { ScreenService } from '../screen.service';

@Injectable({
  providedIn: 'root'
})
export class HomeResolverService implements Resolve<any> {

  constructor(private video: VideoService, private screen: ScreenService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    return this.screen.currentScreen$.pipe(
      switchMap(re => {
        return this.video.getLatest(0, 2 * re + 2, -1);
      }),
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
