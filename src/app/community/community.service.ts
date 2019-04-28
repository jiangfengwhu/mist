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
  getLatest(id: number, size: number, key?: string) {
    let query = `/api/getCircles?fi=${id}&size=${size}`;
    if (key) {
      query = `/api/getCircles?fi=${id}&size=${size}&key=${key}`;
    }
    return this.http.get(query);
  }
  setLike(id: string, type: string, inc: number) {
    return this.http.post(`/api/like?id=${id}&type=${type}&inc=${inc}`, '');
  }
}
