import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private _msg: MessageService) {}
  regist(form: FormData) {
    return this.http.post('/api/regist', form);
  }
  login(form: FormData) {
    return this.http.post('/api/login', form);
  }
  changePic(form: FormData) {
    return this.http.post('/api/changeAvatar', form);
  }
  myvideo(id: number, size: number) {
    return this.http.get(`/api/myvideo?fi=${id}&size=${size}`);
  }
  uservideoall(id: string) {
    return this.http.get('/api/videoall/' + id);
  }
  usercommall(id: string) {
    return this.http.get('/api/commall/' + id);
  }
  usergaall(id: string) {
    return this.http.get('/api/galleryall/' + id);
  }
  delvideos(form: FormData) {
    return this.http.put('/api/delvideoc', form);
  }
  delComms(id: string) {
    return this.http.delete(`/api/delcomms/${id}`);
  }
  delGallery(id: string) {
    return this.http.delete(`/api/delgallery/${id}`);
  }
  updateInfo(form: FormData) {
    return this.http.put('/api/updateinfo', form);
  }
  getUser(id: string) {
    return this.http.get('/api/user/' + id);
  }
}
