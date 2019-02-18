import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScreenService } from 'src/app/screen.service';
import { GalleryService } from '../gallery.service';
import { MessageService } from 'src/app/message.service';

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
    private _msg: MessageService
  ) {}

  hasGif(pics: any[]) {
    for (let i = 0; i < pics.length; ++i) {
      if (pics[i].split('.').pop() === 'gif') {
        return true;
      }
    }
  }
  openDetail(tpl: TemplateRef<any>, index: number) {
    this._msg.openDialog(tpl, {
      data: {
        index: index,
        picindex: 0,
      },
      maxWidth: 800,
      minHeight: 60,
      minWidth: 60,
      panelClass: 'diaborder'
    });
  }
  next(data: any) {
    data.picindex = data.picindex === this.gas[data.index].pics.length - 1 ? 0 : data.picindex + 1;
  }
  pre(data: any) {
    data.picindex = data.picindex === 0 ? this.gas[data.index].pics.length - 1 : data.picindex - 1;
  }
  like(item: any, type: string) {
    if (item.isliked) {
      item.isliked = 0;
      item.likes = item.likes === 1 ? undefined : item.likes - 1;
    } else {
      item.isliked = 1;
      item.likes = item.likes ? item.likes + 1 : 1;
    }
    this.ga.setLike(item.id, type, item.isliked).subscribe();
  }
  openComment(tpl: TemplateRef<any>, id: string) {
    this._msg.openDialog(tpl, {
      data: {
        id: id,
      },
      minWidth: 320,
      maxWidth: '100vw',
      autoFocus: false
    });
  }
  onSendCom(status: boolean, id: string) {
    if (status) {
      const item = this.gas.find(ele => {
        return ele.id === id;
      });
      item.comments = item.comments ? item.comments + 1 : 1;
    }
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
      this.ga.getLatest(this.seq++, 12).subscribe((re: any[]) => {
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
