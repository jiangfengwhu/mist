import { HttpClient } from '@angular/common/http';
import { getMD5 } from './md5.function';
import { timeout } from 'rxjs/operators';
class FileModel {
  file: File;
  msg: string;
  progress: number;
}
class Config {
  url: string;
  chunkSize?: number;
  file: FileModel;
}
export class Uploader {
  private _config: Config;
  private start = 0;
  public md5: string;
  constructor(private http: HttpClient, initConf: Config) {
    this.setConfig(initConf);
    console.log(this._config);
  }
  setConfig(conf: Config) {
    this._config = {
      url: conf.url,
      chunkSize: conf.chunkSize || 5242880,
      file: conf.file,
    };
  }
  initUpload() {
    return new Promise((resolve, reject) => {
      this.file.msg = '计算文件hash';
      getMD5(this.file.file).then((re: string) => {
        this.md5 = re;
        this.file.msg = '查询断点信息';
        this.http.get(this._config.url + '/' + re).subscribe(tp => {
          resolve(tp);
        });
      }).catch(e => {
        reject(e);
      });
    });
  }
  get file() {
    return this._config.file;
  }
  sendData() {
    return new Promise((resolve, reject) => {
      this.file.msg = '上传' + Math.floor(this.start / this.file.file.size * 100) + '%';
      this.file.progress = Math.floor(this.start / this.file.file.size * 100);
      if (this.start >= this.file.file.size) {
        resolve(true);
        return;
      }
      // tslint:disable-next-line:max-line-length
      const end = ((this.start + this._config.chunkSize) >= this.file.file.size) ? this.file.file.size : this.start + this._config.chunkSize;
      const formData = new FormData();
      formData.append('vid', this.md5);
      formData.append('blob', this.file.file.slice(this.start, end));
      this.http.post(this._config.url, formData).pipe(
        timeout(360000)
      ).subscribe(re => {
          if (re['status']) {
            this.start = end;
            resolve(this.sendData());
          } else {
            reject(re['msg']);
          }
        });
    });
  }
  upload() {
    return new Promise((resolve, reject) => {
      this.initUpload().then(re => {
        const index = re['index'];
        if (typeof index !== undefined) {
          console.log('come here', index);
          if (index >= 0) {
            this.start = index;
            this.sendData().then(st => {
              st ? resolve(st) : reject(st);
            }).catch(e => {
              reject(e);
            });
          } else {
            resolve(re);
          }
        } else {
          reject(re['msg']);
        }
      });
    });
  }
}
