import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ProfileComponent } from '../profile/profile.component';
import { ScreenService } from 'src/app/screen.service';

@Component({
  selector: 'mist-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild(ProfileComponent) prof: ProfileComponent;
  navLinks = [
    {label: '我的发布', path: '/user/videos'},
    {label: '修改资料', path: '/user/profile'}
  ];
  constructor(public auth: AuthService, public screen: ScreenService) { }

  ngOnInit() {
  }

}
