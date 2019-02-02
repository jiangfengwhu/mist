import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  rooms = [];
  users = [];
  constructor(private http: HttpClient) {
    this.users['guest'] = {
      nickName: 'guest',
      avatar: 'assets/da.jpg'
    };
  }
  leave(idx: number) {
    this.rooms[idx].conn.close(1000);
    this.rooms.splice(idx, 1);
  }
  getUrl(room: string) {
    return document.location.protocol === 'https:'
      ? 'wss://spectrumlife.online/api/chat/' + room
      : 'ws://127.0.0.1:8080/api/chat/' + room;
  }
  send(idx: number, msg: string) {
    this.rooms[idx].conn.send(
      JSON.stringify({
        header: 'text',
        body: msg
      })
    );
  }
  join(room: string) {
    if (
      !this.rooms.find(ele => {
        return ele.room === room;
      })
    ) {
      // tslint:disable-next-line:max-line-length
      console.log(
        document.location.protocol === 'https:'
          ? 'wss://spectrumlife.online/api/chat/' + room
          : 'ws://127.0.0.1:8080/api/chat/' + room
      );
      const tmpRoom = {
        conn: new WebSocket(this.getUrl(room)),
        room: room,
        msgs: [],
        hasMsg: false,
        isFocus: false
      };
      this.addListener(tmpRoom);
      this.rooms.push(tmpRoom);
    } else {
      return;
    }
    console.log(this.rooms);
  }
  addListener(room: {
    conn: WebSocket;
    room: string;
    msgs: any[];
    info?: any;
    hasMsg: boolean;
    isFocus: boolean;
  }) {
    room.conn.onclose = evt => {
      switch (evt.code) {
        case 1000:
          console.log('leave');
          break;
        default:
          console.log('reconnecting...');
          setTimeout(() => {
            room.conn = new WebSocket(this.getUrl(room.room));
            this.addListener(room);
          }, 1000);
      }
    };
    room.conn.onopen = () => {
      console.log('open');
    };
    room.conn.onmessage = evt => {
      console.log(evt.data);
      const msg = JSON.parse(evt.data);
      console.log(msg);
      if (!this.users[msg.from]) {
        this.http.get('/api/user/' + msg.from).subscribe(re => {
          this.users[msg.from] = re;
          console.log(this.users);
        });
      }
      if (msg.header === 'open' || msg.header === 'close') {
        room.info = msg;
      } else {
        room.hasMsg = room.isFocus ? false : true;
        room.msgs.push(msg);
      }
    };
  }
}
