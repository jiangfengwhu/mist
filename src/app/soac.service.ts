import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SoacService {

  constructor(private http: HttpClient) { }
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
