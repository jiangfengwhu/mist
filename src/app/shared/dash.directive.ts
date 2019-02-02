import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import * as Hls from 'hls.js';
@Directive({
  selector: '[mistDash]'
})
export class DashDirective implements OnDestroy {
  @Input() set src(tmp: string) {
    if (this.isNative) {
      this.videoele.pause();
      this.videoele.src = tmp;
    } else {
      this.hls.detachMedia();
      this.hls.loadSource(tmp);
      this.hls.attachMedia(this.videoele);
    }
  }
  videoele: HTMLVideoElement;
  hls: Hls;
  isNative: boolean;
  constructor(private eleref: ElementRef) {
    this.videoele = this.eleref.nativeElement;
    if (this.videoele.canPlayType('application/vnd.apple.mpegurl')) {
      this.isNative = true;
    } else {
      this.hls = new Hls();
      this.isNative = false;
    }
  }
  ngOnDestroy() {
    if (this.isNative) {
      this.videoele.pause();
      this.videoele.src = '';
    } else {
      this.hls.detachMedia();
      this.hls.destroy();
    }
  }
}
