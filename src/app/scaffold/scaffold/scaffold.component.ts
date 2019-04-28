import { Component, OnInit, TemplateRef } from '@angular/core';
import { ScreenService } from 'src/app/screen.service';
import { AuthService } from 'src/app/auth.service';
import { fadeAnimation } from 'src/app/utils/animation';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
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
  btsRef: MatBottomSheetRef;
  isRouting: boolean;
  isFullScreen = false;
  navs = [
    { label: '视频', link: '/video' },
    { label: '图片', link: '/gallery' },
    { label: '社区', link: '/community' },
    { label: '聊天', link: '/chatroom' },
  ];
  constructor(
    public screen: ScreenService,
    public auth: AuthService,
    private _btmsheet: MatBottomSheet,
    private router: Router,
    public msg: MessageService,
    private updates: SwUpdate
  ) { }

  ngOnInit() {
    this.updates.available.subscribe((evt) => {
      this.msg.openBar('发现新版本, 请刷新获取');
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
  search(val: any) {
    const urlseg = location.href.split('/');
    switch (urlseg[3]) {
      case 'video':
        this.router.navigate(['/video/search/' + val]);
        break;
      case 'community':
        this.router.navigate(['/community/' + val]);
        break;
      default:
    }
  }
}
