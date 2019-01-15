import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, mergeMap } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService {
  constructor(private user: UserService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.paramMap.get('id');
    return this.user.getUser(id).pipe(
      take(1),
      mergeMap(info => {
        if (info) {
          return of(info);
        } else { // id not found
          return EMPTY;
        }
      })
    );
  }
}
