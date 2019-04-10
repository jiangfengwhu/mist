import {
  Component,
  OnInit,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScreenService } from 'src/app/screen.service';
import { MessageService } from 'src/app/message.service';
import { CommunityService } from '../community.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'mist-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit, OnDestroy {
  isLoading = false;
  datasets = [];
  seq = 1;
  constructor(
    private route: ActivatedRoute,
    public screen: ScreenService,
    public _msg: MessageService,
    private comm: CommunityService,
    public auth: AuthService
  ) {}
  next(data: any) {
    data.index = data.index === data.ref.pics.length - 1 ? 0 : data.index + 1;
  }
  pre(data: any) {
    data.index = data.index === 0 ? data.ref.pics.length - 1 : data.index - 1;
  }
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
  ngOnInit() {
    this.route.data.subscribe((data: { comms: any }) => {
      this.datasets = data.comms;
    });
    window.addEventListener('scroll', this.listenScr);
  }
  openDetail(tpl: TemplateRef<any>, index: number, ref: any) {
    this._msg.openDialog(tpl, {
      data: {
        index: index,
        ref: ref
      },
      maxWidth: '100vw',
      panelClass: 'diaborder'
    });
  }
  openComment(tpl: TemplateRef<any>, id: string) {
    this._msg.openDialog(tpl, {
      data: {
        id: id
      },
      minWidth: 320,
      maxWidth: this.screen.isMobile ? '100vw' : '85vw',
      autoFocus: false
    });
  }
  setCont(tmp: string) {
    return tmp
      .split(/\r\n|\r|\n/, 4)
      .join('\n')
      .substr(0, 150);
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
    if (doc.scrollHeight <= scrollTop + doc.offsetHeight + 100) {
      this.isLoading = true;
      this.comm.getLatest(this.seq++, 20).subscribe((re: any[]) => {
        this.isLoading = false;
        if (re) {
          re.forEach(tp => {
            this.datasets.push(tp);
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
