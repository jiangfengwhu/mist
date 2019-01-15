import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EditGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkCanEdit(state.url);
  }
  checkCanEdit(url: string) {
    const id = url.split('/').reverse()[0];
    return this.http.get('/api/checkvown/' + id).pipe(
      map(tmp => {
        if (tmp) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
}
