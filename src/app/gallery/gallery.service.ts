import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  scrollPositon: [number, number] = [0, 0];
  constructor(private http: HttpClient) { }
  uploadImages(form: FormData) {
    return this.http.post('/api/uploadImage', form);
  }
  addGallery(form: any) {
    return this.http.post('/api/addGallery', form);
  }
  getLatest(id: number, size: number) {
    return this.http.get(`/api/getGallery?fi=${id}&size=${size}`);
  }
  setLike(id: string, type: string, inc: number) {
    return this.http.post(`/api/like?id=${id}&type=${type}&inc=${inc}`, '');
  }
  getGallery(id: string) {
    return this.http.get('/api/oneGallery/' + id);
  }
}
