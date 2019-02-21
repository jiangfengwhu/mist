import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { MessageService } from 'src/app/message.service';
import { tap } from 'rxjs/operators';
import { SoacService } from 'src/app/soac.service';
import { ScreenService } from 'src/app/screen.service';

@Component({
  selector: 'mist-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {
  showUser: any;
  datasets = [];
  constructor(
    private route: ActivatedRoute,
    private user: UserService,
    public _msg: MessageService,
    private soac: SoacService,
    public screen: ScreenService
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
    this.soac.setLike(item.id, type, item.isliked).subscribe();
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
    this.route.parent.data.subscribe((data: any) => {
      this.showUser = data.user;
    });
    this.route.data.subscribe((data: any) => {
      this.datasets = data.comms;
    });
  }
  delComms(idx: number) {
    return this.user.delComms(this.datasets[idx].id).pipe(
      tap(re => {
        if (re['status']) {
          this.datasets.splice(idx, 1);
        }
      })
    );
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
}
