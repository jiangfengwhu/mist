import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { VideoService } from './video.service';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchResolverService implements Resolve<any> {

  constructor(private video: VideoService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    return this.video.searchVideo(route.paramMap.get('id'), 50, 0).pipe(
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
