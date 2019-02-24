import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { GalleryService } from './gallery.service';

@Injectable({
  providedIn: 'root'
})
export class HomeResolverService {

  constructor(private ga: GalleryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<never> {
    return this.ga.getLatest(0, 20).pipe(
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
