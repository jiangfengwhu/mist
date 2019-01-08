import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommResolverService {

  constructor(private user: UserService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.user.mycommall().pipe(
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
