import { Component, OnInit, Input } from '@angular/core';
import { ScreenService } from 'src/app/screen.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Uploader } from 'src/app/utils/uploader';
import { VideoService } from '../video.service';

@Component({
  selector: 'mist-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @Input() cid: string;
  isSubmiting = false;
  uploadForm = this._fb.array([], Validators.required);
  uploadfiles = [];
  upIndex = 0;
  constructor(public screen: ScreenService, private _fb: FormBuilder, private _video: VideoService) { }

  setCover(path: string) {
    const form: any = {
      cid: this.cid,
      path: path
    };
    this._video.changeCover(form).subscribe();
  }
  ngOnInit() {
    console.log(this.cid);
  }
  addFiles(files: FileList) {
    console.log(files);
    for (let i = 0; i < files.length; ++i) {
      this.uploadForm.push(this._fb.group({
        title: [files[i].name.substr(0, files[i].name.lastIndexOf('.')), [Validators.required]],
        desc: [''],
        cid: [this.cid, [Validators.required]]
      }));
      this.uploadfiles.push({
        msg: '等待上传',
        progress: 0,
        file: files[i],
        cover: ''
      });
    }
  }
  removeFile(index: number) {
    this.uploadForm.removeAt(index);
    this.uploadfiles.splice(index, 1);
  }
  submit() {
    this.isSubmiting = true;
    if (this.upIndex >= this.uploadfiles.length) {
      this.isSubmiting = false;
      return;
    }
    const uploader = new Uploader(this._video.http, {
      url: '/api/uploadfile',
      file: this.uploadfiles[this.upIndex]
    });
    uploader.upload().then(re => {
      console.log(re);
      if (re) {
        if (re['path']) {
          this.uploadfiles[this.upIndex] = {
            msg: '文件已存在',
            progress: 100,
            cover: re['path']
          };
          this.upIndex++;
          this.submit();
        } else {
          const form = this.uploadForm.controls[this.upIndex].value;
          form.vid = uploader.md5;
          this.uploadfiles[this.upIndex].msg = '正在截取视频缩略图';
          this._video.addVideo(form).subscribe((bc) => {
            console.log(bc);
            this.uploadfiles[this.upIndex].cover = bc['path'] || '';
            this.uploadfiles[this.upIndex].msg = '完毕';
            this.upIndex++;
            this.submit();
          });
        }
      }
    }).catch(e => {
      this.isSubmiting = false;
      console.log(e);
    });
  }
}
