import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import * as WebTorrent from 'webtorrent/webtorrent.min';
@Directive({
  selector: '[mistP2pvideo]',
  exportAs: 'p2pVideo'
})
export class P2pvideoDirective implements OnDestroy {
  client = new WebTorrent();
  currentTorrent: WebTorrent.Torrent;
  @Input() set torrent(tmp: string) {
    if (this.currentTorrent) {
      this.currentTorrent.destroy(() => {
        this.vcf.clear();
        this.addTorrent(tmp);
      });
    } else {
      this.addTorrent(tmp);
    }
  }

  constructor(private tpl: TemplateRef<any>, private vcf: ViewContainerRef) {}

  ngOnDestroy() {
    this.client.destroy(() => {
      console.log('p2p destroyed');
    });
  }
  addTorrent(tmp: string) {
    console.log('add torrent');
    this.client.add(tmp, (torrent: WebTorrent.Torrent) => {
      this.currentTorrent = torrent;
      const file = torrent.files[0];
      const container = this.vcf.createEmbeddedView(this.tpl).rootNodes[0];
      file.renderTo(container);
    });
  }
  getInfo() {
    return this.currentTorrent;
  }
}
