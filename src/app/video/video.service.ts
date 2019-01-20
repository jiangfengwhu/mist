import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(public http: HttpClient) { }
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
  comment(form: any) {
    return this.http.post('/api/addComment', form);
  }
  getComments(id: string, type: string) {
    return this.http.get(`/api/getcomments?id=${id}&type=${type}`);
  }
  setLike(id: string, type: string, inc: number) {
    return this.http.post(`/api/like?id=${id}&type=${type}&inc=${inc}`, '');
  }
}
