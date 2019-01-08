import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ScreenService } from 'src/app/screen.service';
import { fadeAnimation } from 'src/app/utils/animation';

@Component({
  selector: 'mist-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [fadeAnimation]
})
export class UserComponent implements OnInit {
  navLinks = [
    {label: '我的社区', path: '/user/community'},
    {label: '我的视频', path: '/user/videos'},
    {label: '修改资料', path: '/user/profile'}
  ];
  constructor(public auth: AuthService, public screen: ScreenService) { }

  ngOnInit() {
  }

}
