import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import * as shaka from 'shaka-player';
@Directive({
  selector: '[mistDash]'
})
export class DashDirective implements OnDestroy {
  @Input() set src(tmp: string) {
    if (this.isSupport) {
      this.player.unload().then(
        this.player.load(tmp)
      );
    } else {
      this.videoele.pause();
      this.videoele.src = tmp.replace('.mpd', '.mp4');
    }
  }
  videoele: HTMLVideoElement;
  player: any;
  isSupport: boolean;
  constructor(private eleref: ElementRef) {
    this.videoele = this.eleref.nativeElement;
    shaka.polyfill.installAll();
    if (shaka.Player.isBrowserSupported()) {
      this.player = new shaka.Player(this.videoele);
      this.isSupport = true;
    } else {
      this.isSupport = false;
      console.error('Browser not supported!');
    }
  }
  ngOnDestroy() {
    if (this.isSupport) {
      this.player.destroy();
    } else {
      this.videoele.pause();
      this.videoele.src = '';
    }
  }
}
