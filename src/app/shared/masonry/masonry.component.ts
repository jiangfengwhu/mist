import { Component, OnInit, ChangeDetectionStrategy, Input, TemplateRef, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'mist-masonry',
  templateUrl: './masonry.component.html',
  styleUrls: ['./masonry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasonryComponent implements OnInit {
  @Input() datasets: any[];
  @Input() set columns(tmp: number) {
    console.log('size change');
    this.currentColumn = tmp;
    this.splitItem(tmp);
    this.previousLength = this.datasets.length;
  }
  @Input() tpl: TemplateRef<any>;
  group = [];
  currentColumn: number;
  previousLength: number;
  constructor(private detect: ChangeDetectorRef) { }

  markForDetection() {
    console.log('change');
    if (this.datasets.length > this.previousLength) {
      for (let i = this.previousLength; i < this.datasets.length; i++) {
        this.group[i % this.currentColumn].push(i);
      }
    } else {
      for (let i = this.previousLength; i > this.datasets.length; i--) {
        this.group[(i - 1) % this.currentColumn].pop();
      }
    }
    this.detect.markForCheck();
    this.previousLength = this.datasets.length;
  }
  ngOnInit() {
  }
  trackByIndex(index: number, cont: number) {
    return cont;
  }
  splitItem(cols: number) {
    this.group = [];
    const depth = Math.floor(this.datasets.length / cols);
    const residu = this.datasets.length % cols;
    for (let i = 0; i < cols; ++i) {
      const glength = i < residu ? depth + 1 : depth;
      this.group[i] = Array.from({ length: glength }).map((_, index) => {
        return i + index * cols;
      });
    }
  }
}
