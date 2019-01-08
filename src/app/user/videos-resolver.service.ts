import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { take, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideosResolverService implements Resolve<any> {

  constructor(private user: UserService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.user.myvideoall().pipe(
      take(1),
      mergeMap(info => {
        if (info) {
          return of(info);
        } else { // id not found
          return of([]);
        }
      })
    );
  }
}
