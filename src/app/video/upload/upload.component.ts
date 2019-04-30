import { Component, OnInit } from '@angular/core';
import { ScreenService } from 'src/app/screen.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Uploader } from 'src/app/utils/uploader';
import { VideoService } from '../video.service';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'mist-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  isSubmiting = false;
  uploadForm = this._fb.array([], Validators.required);
  uploadfiles = [];
  upIndex = 0;
  globalTag = new FormControl(1);
  globalCap = new FormControl(30);
  constructor(public screen: ScreenService, private _fb: FormBuilder, public _video: VideoService, public _msg: MessageService) { }

  ngOnInit() { }
  openConfig(tpl: any) {
    this._msg.openDialog(tpl);
  }
  addFiles(files: FileList) {
    for (let i = 0; i < files.length; ++i) {
      this.uploadfiles.push({
        msg: '等待上传',
        progress: 0,
        file: files[i],
      });
      this.uploadForm.push(this._fb.group({
        title: [files[i].name.substr(0, files[i].name.lastIndexOf('.')), [Validators.required]],
        tag: [this.globalTag.value, [Validators.required]],
        coverPos: [this.globalCap.value, [Validators.min(0), Validators.required, Validators.max(65534)]],
        desc: [''],
      }));
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
        if (re['index'] === -1) {
          this.uploadfiles[this.upIndex] = {
            msg: '文件已存在',
            progress: 100,
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
