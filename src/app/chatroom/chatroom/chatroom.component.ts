import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'mist-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatbody') chatbody: ElementRef;
  selected = 0;
  constructor(public chat: ChatService) {}
  send(msg: HTMLTextAreaElement, idx: number) {
    this.chat.send(idx, msg.value);
    msg.value = '';
  }
  ngOnInit() {}
  ngAfterViewChecked() {
    if (this.chatbody) {
      this.chatbody.nativeElement.scrollTop = this.chatbody.nativeElement.scrollHeight;
    }
  }
  join(room: string) {
    this.chat.join(room);
    this.selected = this.chat.rooms.length - 1;
  }
  leave(idx: number) {
    this.chat.leave(idx);
    this.selected = this.chat.rooms.length - 1;
  }
  changeIndex(idx: number) {
    if (idx < 0) {
      return;
    }
    this.selected = idx;
    this.chat.rooms.forEach((ele, index) => {
      if (index === idx) {
        ele.isFocus = true;
      } else {
        ele.isFocus = false;
      }
    });
    this.chat.rooms[idx].hasMsg = false;
    console.log(idx);
  }
}
