import { Directive, OnDestroy, Input, OnInit, ElementRef } from '@angular/core';
import * as Hls from 'hls.js';
@Directive({
  selector: '[mistHls]'
})
export class HlsDirective implements OnDestroy, OnInit {
  @Input() src: string;
  videoele: HTMLVideoElement;
  hls: Hls;
  isNative: boolean;
  start() {
    if (this.hls) {
      this.togglePlay();
    } else {
      this.hls = new Hls({
        maxBufferLength: 10
      });
      this.hls.loadSource(this.src);
      this.hls.attachMedia(this.videoele);
      this.videoele.play();
    }
  }
  togglePlay() {
    this.videoele.paused ? this.videoele.play() : this.videoele.pause();
  }
  constructor(private eleref: ElementRef) {}
  ngOnInit() {
    this.videoele = this.eleref.nativeElement;
    if (Hls.isSupported()) {
      this.isNative = false;
      this.videoele.onclick = ev => {
        this.start();
      };
    } else {
      this.isNative = true;
      this.videoele.src = this.src;
      this.videoele.controls = true;
    }
  }
  ngOnDestroy() {
    if (this.isNative) {
      this.videoele.pause();
      this.videoele.src = '';
    } else {
      if (this.hls) {
        this.hls.detachMedia();
        this.hls.destroy();
      }
    }
  }
}
