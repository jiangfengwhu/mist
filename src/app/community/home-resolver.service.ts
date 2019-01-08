import { Injectable } from '@angular/core';
import { CommunityService } from './community.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeResolverService {

  constructor(private comm: CommunityService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    return this.comm.getLatest(0, 12).pipe(
      take(1),
      mergeMap(comms => {
        if (comms) {
          return of(comms);
        } else { // id not found
          return of([]);
        }
      })
    );
  }
}
