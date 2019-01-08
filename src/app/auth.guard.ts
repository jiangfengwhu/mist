import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from './auth.service';
import { map, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _auth: AuthService, private router: Router) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkLogin(state.url);
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }
  checkLogin(url: string) {
    if (this._auth.user) {
      return true;
    }
    if (this._auth.user === null) {
      this.router.navigate(['/user/login']);
      this._auth.redirectUrl = url;
      return false;
    } else {
      console.log('http log');
      return this._auth.user$.pipe(
        map(tmp => {
          if (tmp['status']) {
            return true;
          } else {
            this._auth.redirectUrl = url;
            this.router.navigate(['/user/login']);
            return false;
          }
        }),
        catchError(() => {
          this._auth.redirectUrl = url;
          this.router.navigate(['/user/login']);
          return of(false);
        })
      );
    }
  }
}
