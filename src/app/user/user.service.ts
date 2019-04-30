import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private _msg: MessageService) { }
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
  mylist(id: string) {
    return this.http.get('/api/listAll/' + id);
  }
  addList(title: any) {
    return this.http.post('/api/newlist', title);
  }
  addToList(data: any) {
    return this.http.put('/api/addtolist', data);
  }
  removeFromList(data: any) {
    return this.http.put('/api/refromlist', data);
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
  delList(id: string) {
    return this.http.delete(`/api/dellist/${id}`);
  }
  delGallery(id: string) {
    return this.http.delete(`/api/delgallery/${id}`);
  }
  updateInfo(form: FormData) {
    return this.http.put('/api/updateinfo', form);
  }
  updateList(form: any) {
    return this.http.put('/api/updatelist', form);
  }
  getUser(id: string) {
    return this.http.get('/api/user/' + id);
  }
}
