import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { MessageService } from 'src/app/message.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'mist-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {
  showUser: any;
  datasets = [];
  constructor(private route: ActivatedRoute, private user: UserService, public _msg: MessageService) { }

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
      maxWidth: 800,
      maxHeight: '85vh',
      minHeight: 50,
      minWidth: 50,
      panelClass: 'diaborder'
    });
  }
}
