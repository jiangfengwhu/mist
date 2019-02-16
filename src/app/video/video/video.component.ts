import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ScreenService } from 'src/app/screen.service';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../video.service';

@Component({
  selector: 'mist-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoComponent implements OnInit, OnDestroy {
  isLoading = false;
  seq = 1;
  videos: any[];
  constructor(public screen: ScreenService, private route: ActivatedRoute, public _video: VideoService) { }

  ngOnInit() {
    this.route.data.subscribe((data: { videos: any }) => {
      this.videos = data.videos;
    });
    window.addEventListener('scroll', this.listenScr);
  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.listenScr);
  }
  listenScr = () => {
    const doc = document.documentElement;
    const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
    if (doc.scrollHeight === scrollTop + doc.offsetHeight) {
      this.isLoading = true;
      this._video.getLatest(this.seq++, 12).subscribe((re: any[]) => {
        this.isLoading = false;
        if (re) {
          re.forEach(tp => {
            this.videos.push(tp);
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
