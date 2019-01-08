import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScreenService } from 'src/app/screen.service';

@Component({
  selector: 'mist-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  video: any;
  currentVideo = 0;
  constructor(private route: ActivatedRoute, public screen: ScreenService) { }

  ngOnInit() {
    this.route.data.subscribe((data: {video: any}) => {
      this.video = data.video;
      console.log(this.video);
    });
  }
  changeSrc(index: number) {
    this.currentVideo = index;
  }
}
