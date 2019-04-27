import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  currentScreen: number;
  currentScreen$: Observable<number>;
  isMobile: boolean;
  private _points = [
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge
  ];
  constructor(private _breakPoints: BreakpointObserver) {
    this.currentScreen$ = this._breakPoints.observe(this._points).pipe(
      map(re => {
        for (let i = 0; i < 5; i++) {
          if (re.breakpoints[this._points[i]]) {
            return i + 1;
          }
        }
      })
    );
    this.currentScreen$.subscribe(re => {
      this.currentScreen = re;
      if (re >= 2) {
        this.isMobile = false;
      } else {
        this.isMobile = true;
      }
    });
  }
}
