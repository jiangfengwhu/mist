import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenService } from 'src/app/screen.service';
import { GalleryService } from '../gallery.service';

@Component({
  selector: 'mist-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  seq = 1;
  gas = [];
  constructor(
    private acr: ActivatedRoute,
    public screen: ScreenService,
    private ga: GalleryService,
    private router: Router
  ) {}

  hasGif(pics: any[]) {
    for (let i = 0; i < pics.length; ++i) {
      if (pics[i].split('.').pop() === 'gif') {
        return true;
      }
    }
  }
  goto(id: string) {
    this.ga.scrollPositon = [window.scrollX, window.scrollY];
    this.router.navigate(['./', id], {
      relativeTo: this.acr
    });
  }

  ngOnInit() {
    this.acr.data.subscribe((data: { gas: any }) => {
      this.gas = data.gas;
    });
    window.addEventListener('scroll', this.listenScr);
  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.listenScr);
  }
  listenScr = () => {
    const doc = document.documentElement;
    const scrollTop = Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    if (doc.scrollHeight === scrollTop + doc.offsetHeight) {
      this.isLoading = true;
      this.ga.getLatest(this.seq++, 20).subscribe((re: any[]) => {
        this.isLoading = false;
        if (re) {
          re.forEach(tp => {
            this.gas.push(tp);
          });
          window.addEventListener('scroll', this.listenScr);
        } else {
          window.removeEventListener('scroll', this.listenScr);
        }
      });
      window.removeEventListener('scroll', this.listenScr);
    }
  }
}
