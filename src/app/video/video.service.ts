import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(public http: HttpClient, private _msg: MessageService) { }
  createCollection(form: any) {
    return this.http.post('/api/createCollection', form);
  }
  addVideo(form: any) {
    return this.http.post('/api/addVideo', form);
  }
  changeCover(form: any) {
    return this.http.post('/api/changeVC', form);
  }
  getLatest(id: number, size: number) {
    return this.http.get(`/api/getVideo?fi=${id}&size=${size}`);
  }
  getVideo(id: string) {
    return this.http.get('/api/getVideo/' + id);
  }
  updateVC(form: FormData) {
    return this.http.put('/api/updatevc', form);
  }
  updateVideo(form: FormData) {
    return this.http.put('/api/updatevideo', form);
  }
  delOne(vid: string, cid: string, cov: string) {
    return this.http.delete(`/api/delvideo?vid=${vid}&cid=${cid}&cov=${cov}`);
  }
}
