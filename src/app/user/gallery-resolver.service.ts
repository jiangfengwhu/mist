import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { take, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalleryResolverService implements Resolve<any> {
  constructor(private user: UserService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.parent.paramMap.get('id');
    return this.user.usergaall(id).pipe(
      take(1),
      mergeMap(info => {
        if (info) {
          return of(info);
        } else {
          // id not found
          return of([]);
        }
      })
    );
  }
}
