import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private _msg: MessageService) {}
  regist(form: FormData) {
    return this.http.post('/api/regist', form).pipe(
      tap(re => {
        this._msg.openBar(re['msg']);
      })
    );
  }
  login(form: FormData) {
    return this.http.post('/api/login', form).pipe(
      tap(re => {
        this._msg.notify(re);
      })
    );
  }
  changePic(form: FormData) {
    return this.http.post('/api/changeAvatar', form).pipe(
      tap(re => {
        this._msg.notify(re);
      })
    );
  }
  myvideo(id: number, size: number) {
    return this.http.get(`/api/myvideo?fi=${id}&size=${size}`);
  }
  myvideoall() {
    return this.http.get('/api/myvideoall');
  }
  delvideos(form: FormData) {
    return this.http.put('/api/delvideoc', form).pipe(
      tap(re => {
        this._msg.notify(re);
      })
    );
  }
}
