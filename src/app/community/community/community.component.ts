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
import { MatDialogRef } from '@angular/material';
import { CommunityService } from '../community.service';
import { MasonryComponent } from 'src/app/shared/masonry/masonry.component';

@Component({
  selector: 'mist-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements OnInit, OnDestroy {
  @ViewChild(MasonryComponent) msn: MasonryComponent;
  dialogRef: MatDialogRef<any>;
  isLoading = false;
  datasets = [];
  seq = 1;
  constructor(
    private route: ActivatedRoute,
    public screen: ScreenService,
    private _msg: MessageService,
    private comm: CommunityService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: { comms: any }) => {
      this.datasets = data.comms;
    });
    window.addEventListener('scroll', this.listenScr);
  }
  openDetail(tpl: TemplateRef<any>, pic: string) {
    this.dialogRef = this._msg.openDialog(tpl, {
      data: {
        src: pic
      },
      maxWidth: 800,
      maxHeight: 800,
      panelClass: this.screen.currentScreen >= 2 ? '' : 'fullscreen'
    });
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
        if (re) {
          re.forEach(tp => {
            this.datasets.push(tp);
          });
          this.msn.markForDetection();
          window.addEventListener('scroll', this.listenScr);
        } else {
          window.removeEventListener('scroll', this.listenScr);
        }
      });
      window.removeEventListener('scroll', this.listenScr);
    }
  }
}
