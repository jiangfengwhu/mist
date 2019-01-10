import { Component, OnInit, TemplateRef } from '@angular/core';
import { ScreenService } from 'src/app/screen.service';
import { AuthService } from 'src/app/auth.service';
import { fadeAnimation } from 'src/app/utils/animation';
import { MatBottomSheet, MatBottomSheetRef, MatDialogRef } from '@angular/material';
import {
  Router,
  RouterEvent,
  NavigationStart,
  NavigationError,
  NavigationCancel,
  NavigationEnd
} from '@angular/router';
import { MessageService } from 'src/app/message.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'mist-scaffold',
  templateUrl: './scaffold.component.html',
  styleUrls: ['./scaffold.component.scss'],
  animations: [fadeAnimation]
})
export class ScaffoldComponent implements OnInit {
  dialogRef: MatDialogRef<any>;
  btsRef: MatBottomSheetRef;
  isRouting: boolean;
  isFullScreen = false;
  navs = [
    { label: '视频', link: '/video' },
    { label: '社区', link: '/community'}
  ];
  constructor(
    public screen: ScreenService,
    public auth: AuthService,
    private _btmsheet: MatBottomSheet,
    private router: Router,
    private _msg: MessageService,
    private updates: SwUpdate
  ) {}

  ngOnInit() {
    this.updates.available.subscribe((evt) => {
      this._msg.openBar('发现新版本, 请刷新获取');
    });
    this.auth.user$.subscribe(re => {
      if (re['status']) {
        this.auth.user = re['user'];
        console.log(this.auth.user);
      } else {
        this.auth.user = null;
      }
    });
    this.router.events.subscribe((event: RouterEvent) => {
      switch (event.constructor) {
        case NavigationStart:
          this.isRouting = true;
          break;
        case NavigationError:
        case NavigationCancel:
        case NavigationEnd:
          this.isRouting = false;
          break;
      }
    });
  }
  openConfirm(tpl: TemplateRef<any>) {
    this.dialogRef = this._msg.openDialog(tpl);
  }
  logout() {
    this.auth.logout().subscribe(() => {
      this.dialogRef.close();
    });
  }
  openMenu(bts: TemplateRef<any>) {
    this.btsRef = this._btmsheet.open(bts);
  }
  closeMenu() {
    this.btsRef.dismiss();
  }
  toggleFullScreen() {
    const elem: any = document.documentElement;
    if (elem.requestFullscreen) {
      this.isFullScreen ? document.exitFullscreen() : elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      this.isFullScreen
        ? (document as any).webkitExitFullscreen()
        : elem.webkitRequestFullscreen();
    }
    this.isFullScreen = !this.isFullScreen;
  }
}
