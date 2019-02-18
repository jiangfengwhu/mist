import { Component, OnInit } from '@angular/core';
import { ScreenService } from 'src/app/screen.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/message.service';
import { UserService } from '../user.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'mist-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  gas = [];
  constructor(
    public screen: ScreenService,
    private route: ActivatedRoute,
    public _msg: MessageService,
    private user: UserService
  ) {}
  hasGif(pics: any[]) {
    for (let i = 0; i < pics.length; ++i) {
      if (pics[i].split('.').pop() === 'gif') {
        return true;
      }
    }
  }
  ngOnInit() {
    this.route.data.subscribe((data: { gas: any }) => {
      this.gas = data.gas;
    });
  }
  delgallery(idx: number) {
    return this.user.delGallery(this.gas[idx].id).pipe(
      tap(re => {
        if (re['status']) {
          this.gas.splice(idx, 1);
        }
      })
    );
  }
}
