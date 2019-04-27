import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ScreenService } from 'src/app/screen.service';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../video.service';

@Component({
  selector: 'mist-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoComponent implements OnInit {
  seq = Array(this._video.tags.length).fill(1);
  isLoading = Array(this._video.tags.length).fill(false);
  tagVideos: any[];
  constructor(
    public screen: ScreenService,
    private route: ActivatedRoute,
    public _video: VideoService,
    private detec: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { videos: any }) => {
      this.tagVideos = data.videos;
    });
  }
  refresh(tag: number) {
    this.isLoading[tag] = true;
    this._video.getLatest(this.seq[tag]++, this.screen.currentScreen * 2 + 2, tag + 1).subscribe(re => {
      if (re[0]) {
        this.tagVideos[tag] = re[0];
      } else {
        this.seq[tag] = 1;
        this.refresh(tag);
      }
      this.isLoading[tag] = false;
      this.detec.markForCheck();
    });
  }
}
