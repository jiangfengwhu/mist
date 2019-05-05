import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  tags = ['番剧', '学习', '电影', '动漫', '游戏', '音乐', '日常', '资讯', '科技', '搞笑', '舞蹈'];

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
  getLatest(id: number, size: number, tag: number) {
    return this.http.get(`/api/getVideo?fi=${id}&size=${size}&tag=${tag}`);
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
  searchVideo(key: string, size: number, fi: number) {
    return this.http.get(`/api/searchVideo?key=${key}&size=${size}&fi=${fi}`);
  }
  getSub(location: string) {
    return this.http.get(location, { responseType: 'text' });
  }
  delSub(form: any) {
    return this.http.put('/api/delsub', form);
  }
  addSub(form: FormData) {
    return this.http.put('/api/addsub', form);
  }
}
