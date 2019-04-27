import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../video.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'mist-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent implements OnInit, OnDestroy {
  isLoading = false;
  id$: any;
  id: number;
  datasets: any[];
  seq = 1;
  // tslint:disable-next-line:max-line-length
  constructor(private router: ActivatedRoute, public videoservice: VideoService, private route: Router, private changedec: ChangeDetectorRef) { }

  ngOnInit() {
    this.router.data.subscribe((data: any) => {
      this.seq = 1;
      this.datasets = data.videos[0];
      window.addEventListener('scroll', this.listenScr);
    });
    this.id$ = this.router.paramMap.pipe(
      map(re => {
        this.id = parseInt(re.get('id'), 10) - 1;
        return this.id;
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
      this.videoservice.getLatest(this.seq++, 20, this.id + 1).subscribe((re: any[]) => {
        this.isLoading = false;
        if (re[0]) {
          re[0].forEach(tp => {
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
