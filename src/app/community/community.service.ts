import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  constructor(private http: HttpClient, private _msg: MessageService) { }
  uploadImages(form: FormData) {
    return this.http.post('/api/uploadImage', form);
  }
  addCircle(form: any) {
    return this.http.post('/api/addCircle', form);
  }
  getLatest(id: number, size: number) {
    return this.http.get(`/api/getCircles?fi=${id}&size=${size}`);
  }
}
