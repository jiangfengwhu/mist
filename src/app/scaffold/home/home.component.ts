import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'mist-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public msg: MessageService) { }

  ngOnInit() {
    const img = new Image();
    img.src = 'assets/qrcode.jpeg';
  }
  openDonate(tpl: any) {
    this.msg.openDialog(tpl, {
      panelClass: 'diaborder'
    });
  }
}
