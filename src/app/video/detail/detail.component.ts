import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScreenService } from 'src/app/screen.service';
import { SoacService } from 'src/app/soac.service';

@Component({
  selector: 'mist-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  video: any;
  constructor(
    private route: ActivatedRoute,
    public screen: ScreenService,
    private vs: SoacService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { video: any }) => {
      this.video = data.video;
    });
  }
  like(item: any, type: string) {
    if (item.isliked) {
      item.isliked = 0;
      item.likes = item.likes === 1 ? undefined : item.likes - 1;
    } else {
      item.isliked = 1;
      item.likes = item.likes ? item.likes + 1 : 1;
    }
    this.vs.setLike(item.id, type, item.isliked).subscribe();
  }
}
