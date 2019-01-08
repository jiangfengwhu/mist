import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(public http: HttpClient, private _msg: MessageService) { }
  createCollection(form: any) {
    return this.http.post('/api/createCollection', form).pipe(
      tap(re => {
        this._msg.notify(re);
      })
    );
  }
  addVideo(form: any) {
    return this.http.post('/api/addVideo', form).pipe(
      tap(re => {
        this._msg.notify(re);
      })
    );
  }
  changeCover(form: any) {
    return this.http.post('/api/changeVC', form).pipe(
      tap(re => {
        this._msg.notify(re);
      })
    );
  }
  getLatest(id: number, size: number) {
    return this.http.get(`/api/getVideo?fi=${id}&size=${size}`);
  }
  getVideo(id: string) {
    return this.http.get('/api/getVideo/' + id);
  }
  updateVC(form: FormData) {
    return this.http.put('/api/updatevc', form).pipe(
      tap(re => {
        this._msg.notify(re);
      })
    );
  }
  updateVideo(form: FormData) {
    return this.http.put('/api/updatevideo', form).pipe(
      tap(re => {
        this._msg.notify(re);
      })
    );
  }
  delOne(vid: string, cid: string, cov: string) {
    return this.http.delete(`/api/delvideo?vid=${vid}&cid=${cid}&cov=${cov}`).pipe(
      tap(re => {
        this._msg.notify(re);
      })
    );
  }
}
