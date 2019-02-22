import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import * as Hls from 'hls.js';
declare var p2pml: any;
@Directive({
  selector: '[mistP2PHls]',
  exportAs: 'p2pHls'
})
export class P2PHlsDirective implements OnDestroy {
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
  numPeers = 1;
  uploaded = 0;
  engine: any;
  constructor(private eleref: ElementRef) {
    this.videoele = this.eleref.nativeElement;
    if (Hls.isSupported()) {
      this.isNative = false;
      this.initP2P();
    } else {
      this.isNative = true;
    }
  }
  ngOnDestroy() {
    if (this.isNative) {
      this.videoele.pause();
      this.videoele.src = '';
    } else {
      this.hls.detachMedia();
      this.hls.destroy();
      this.engine.destroy();
    }
  }
  initP2P() {
    this.engine = new p2pml.hlsjs.Engine({
      loader: {
        requiredSegmentsPriority: 9,
        trackerAnnounce: ['wss://spectrumlife.online/websocket'],
        rtcConfig: {
          iceServers: [
            {
              urls: 'stun:144.34.190.154:3478'
            }
          ]
        }
      }
    });
    this.hls = new Hls({
      liveSyncDurationCount: 10,
      maxBufferLength: 300,
      loader: this.engine.createLoaderClass()
    });
    p2pml.hlsjs.initHlsJsPlayer(this.hls);
    const loader = this.engine.getSettings().loader;
    console.log(loader);
    this.engine.on(p2pml.core.Events.PeerConnect, (peer) => {
      ++this.numPeers;
    });
    this.engine.on(p2pml.core.Events.PeerClose, (peer) => {
      --this.numPeers;
    });
    this.engine.on(p2pml.core.Events.PieceBytesUploaded, (method, bytes, peerId) => {
      this.uploaded += bytes;
    });
  }
}
