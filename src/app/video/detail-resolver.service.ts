import { Injectable } from '@angular/core';
import { VideoService } from './video.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DetailResolverService {
  constructor(private video: VideoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    const id = route.paramMap.get('id');

    return this.video.getVideo(id).pipe(
      take(1),
      mergeMap(video => {
        if (video) {
          return of(video);
        } else {
          this.router.navigate(['/video']);
          return EMPTY;
        }
      })
    );
  }
}
