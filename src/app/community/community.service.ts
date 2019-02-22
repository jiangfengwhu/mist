import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  constructor(public http: HttpClient) { }
  uploadImages(form: FormData) {
    return this.http.post('/api/uploadImage', form);
  }
  addCircle(form: any) {
    return this.http.post('/api/addCircle', form);
  }
  getLatest(id: number, size: number) {
    return this.http.get(`/api/getCircles?fi=${id}&size=${size}`);
  }
  setLike(id: string, type: string, inc: number) {
    return this.http.post(`/api/like?id=${id}&type=${type}&inc=${inc}`, '');
  }
}
