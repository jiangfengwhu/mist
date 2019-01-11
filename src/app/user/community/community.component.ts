import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { MessageService } from 'src/app/message.service';
import { MatDialogRef } from '@angular/material';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'mist-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {
  dialogRef: MatDialogRef<any>;
  datasets = [];
  constructor(private route: ActivatedRoute, private user: UserService, public _msg: MessageService) { }

  ngOnInit() {
    this.route.data.subscribe((data: { comms: any }) => {
      this.datasets = data.comms;
      console.log(data.comms);
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
  previous(data: any) {
    if (data.index > 0) {
      --data.index;
    }
  }
  next(data: any) {
    if (data.index < data.ref.pics.length - 1) {
      ++data.index;
    }
  }
  openDetail(tpl: TemplateRef<any>, index: number, ref: any) {
    this.dialogRef = this._msg.openDialog(tpl, {
      data: {
        index: index,
        ref: ref
      },
      maxWidth: 800,
      maxHeight: '85vh',
      panelClass: 'diaborder'
    });
  }
}
