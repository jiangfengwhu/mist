import { Component, OnInit } from '@angular/core';
import { ScreenService } from 'src/app/screen.service';
import { fadeAnimation } from 'src/app/utils/animation';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mist-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [fadeAnimation]
})
export class UserComponent implements OnInit {
  user: any;
  navLinks = [
    {label: '社区', path: './community'},
    {label: '视频', path: './videos'},
    {label: '资料', path: './profile'}
  ];
  constructor(public screen: ScreenService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;
    });
  }

}
