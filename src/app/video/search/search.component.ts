import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ScreenService } from 'src/app/screen.service';
import { VideoService } from '../video.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'mist-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {
  isLoading = false;
  key$: any;
  key: string;
  datasets: any;
  seq = 1;
  // tslint:disable-next-line:max-line-length
  constructor(private router: ActivatedRoute, public videoservice: VideoService, private route: Router, private changedec: ChangeDetectorRef, public screen: ScreenService) { }

  ngOnInit() {
    this.router.data.subscribe((data: any) => {
      this.datasets = data.videos;
      window.addEventListener('scroll', this.listenScr);
    });
    this.key$ = this.router.paramMap.pipe(
      map(re => {
        this.key = re.get('id');
        this.seq = 0;
        this.videoservice.searchVideo(this.key, 50, this.seq++).subscribe(sre => {
          this.datasets = sre;
          this.changedec.markForCheck();
        });
        return this.key;
      })
    );
  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.listenScr);
  }
  indexChange(index: number) {
    this.route.navigate(['/video/category/' + (index + 1)]);
  }
  listenScr = () => {
    const doc = document.documentElement;
    const scrollTop = Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    if (doc.scrollHeight <= scrollTop + doc.offsetHeight + 100) {
      this.isLoading = true;
      this.changedec.markForCheck();
      this.videoservice.searchVideo(this.key, 50, this.seq++).subscribe((re: any[]) => {
        this.isLoading = false;
        if (re) {
          re.forEach(tp => {
            this.datasets.push(tp);
          });
          window.addEventListener('scroll', this.listenScr);
        } else {
          window.removeEventListener('scroll', this.listenScr);
        }
        this.changedec.markForCheck();
      });
      window.removeEventListener('scroll', this.listenScr);
    }
  }
}
