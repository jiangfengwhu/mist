import {
  Component,
  OnInit,
  TemplateRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScreenService } from 'src/app/screen.service';
import { MessageService } from 'src/app/message.service';
import { CommunityService } from '../community.service';
import { MasonryComponent } from 'src/app/shared/masonry/masonry.component';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'mist-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements OnInit, OnDestroy {
  @ViewChild(MasonryComponent) msn: MasonryComponent;
  preloadImgs = [];
  preloadindex = 0;
  isLoading = false;
  datasets = [];
  seq = 1;
  constructor(
    private route: ActivatedRoute,
    public screen: ScreenService,
    public _msg: MessageService,
    private comm: CommunityService,
    public auth: AuthService
  ) { }
  like(item: any, type: string) {
    if (item.isliked) {
      item.isliked = 0;
      item.likes = item.likes === 1 ? undefined : item.likes - 1;
    } else {
      item.isliked = 1;
      item.likes = item.likes ? item.likes + 1 : 1;
    }
    this.comm.setLike(item.id, type, item.isliked).subscribe();
  }
  onSendCom(status: boolean, id: string) {
    if (status) {
      const item = this.datasets.find(ele => {
        return ele.id === id;
      });
      item.comments = item.comments ? item.comments + 1 : 1;
    }
  }
  preload() {
    if (this.preloadindex >= this.preloadImgs.length) {
      return;
    }
    const src = this.preloadImgs[this.preloadindex];
    this.preloadImgs[this.preloadindex] = new Image();
    this.preloadImgs[this.preloadindex].src = src;
    this.preloadImgs[this.preloadindex].onload = () => {
      ++this.preloadindex;
      this.preload();
    };
  }
  ngOnInit() {
    this.route.data.subscribe((data: { comms: any }) => {
      this.datasets = data.comms;
      this.datasets.forEach(val => {
        if (val.pics) {
          val.pics.forEach(imgpath => {
            this.preloadImgs.push(imgpath);
          });
        }
      });
      this.preload();
    });
    window.addEventListener('scroll', this.listenScr);
  }
  openDetail(tpl: TemplateRef<any>, index: number, ref: any) {
    this._msg.openDialog(tpl, {
      data: {
        index: index,
        ref: ref
      },
      maxWidth: 800,
      maxHeight: '85vh',
      minHeight: 50,
      minWidth: 50,
      panelClass: 'diaborder'
    });
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
  setCont(tmp: string) {
    return tmp.split(/\r\n|\r|\n/, 4).join('\n').substr(0, 150);
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
      this.comm.getLatest(this.seq++, 12).subscribe((re: any[]) => {
        this.isLoading = false;
        const oldindex = this.preloadImgs.length;
        if (re) {
          re.forEach(tp => {
            this.datasets.push(tp);
            if (tp.pics) {
              tp.pics.forEach(val => {
                this.preloadImgs.push(val);
              });
            }
          });
          this.msn.markForDetection();
          if (this.preloadindex === oldindex) {
            this.preload();
          }
          window.addEventListener('scroll', this.listenScr);
        } else {
          window.removeEventListener('scroll', this.listenScr);
        }
      });
      window.removeEventListener('scroll', this.listenScr);
    }
  }
}
