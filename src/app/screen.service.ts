import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  currentScreen: number;
  isMobile: boolean;
  private _points = [
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge
  ];
  constructor(private _breakPoints: BreakpointObserver) {
    this.observeScreen();
  }
  observeScreen() {
    this._breakPoints.observe(this._points).subscribe(re => {
      for (let i = 0; i < 5; i++) {
        if (re.breakpoints[this._points[i]]) {
          this.currentScreen = i + 1;
          if (i + 1 >= 2) {
            this.isMobile = false;
          } else {
            this.isMobile = true;
          }
          break;
        }
      }
    });
  }
}
