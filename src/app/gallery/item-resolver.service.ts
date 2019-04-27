import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { GalleryService } from './gallery.service';

@Injectable({
  providedIn: 'root'
})
export class ItemResolverService implements Resolve<any> {
  constructor(private ga: GalleryService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    const id = route.paramMap.get('id');

    return this.ga.getGallery(id).pipe(
      take(1),
      mergeMap(ga => {
        if (ga) {
          return of(ga);
        } else {
          this.router.navigate(['/gallery']);
          return EMPTY;
        }
      })
    );
  }
}
