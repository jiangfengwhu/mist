import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ScreenService } from 'src/app/screen.service';
import { getMD5 } from 'src/app/utils/md5.function';
import { CommunityService } from '../community.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/message.service';
import { Uploader } from 'src/app/utils/uploader';

@Component({
  selector: 'mist-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  cont: string;
  postForm = {
    cont: '',
    pics: [],
    embed: '',
  };
  imgItem = [];
  videoItem: any = {
    file: null,
  };
  videoUrl: any;
  isSubmitting = false;
  constructor(
    public auth: AuthService,
    public screen: ScreenService,
    private comm: CommunityService,
    private router: Router,
    private _msg: MessageService
  ) {}

  ngOnDestroy() {
    for (let i = 0; i < this.imgItem.length; i++) {
      URL.revokeObjectURL(this.imgItem[i].url);
    }
    URL.revokeObjectURL(this.videoUrl);
  }
  ngOnInit() {}
  addFiles(file: FileList) {
    for (let i = 0; i < file.length; i++) {
      if (this.imgItem.length < 4) {
        this.imgItem.push({
          url: URL.createObjectURL(file[i]),
          file: file[i],
          deletable: true,
          msg: '等待'
        });
      } else {
        alert('最多4张图片');
        return;
      }
    }
  }
  addVideo(file: FileList) {
    const vfile = file[0];
    if (vfile.size > 15 * 1024 * 1024) {
      this._msg.openBar('视频文件不能超过15MB');
      return;
    }
    URL.revokeObjectURL(this.videoUrl);
    this.videoUrl = URL.createObjectURL(vfile);
    this.videoItem.file = vfile;
    this.videoItem.msg = '准备上传';
  }
  submit() {
    this.isSubmitting = true;
    this.uploadImage(0);
  }
  delete(index: number) {
    URL.revokeObjectURL(this.imgItem[index].url);
    this.imgItem.splice(index, 1);
  }
  addCircle() {
    this.comm.addCircle(this.postForm).subscribe(re => {
      this.isSubmitting = false;
      if (re['status']) {
        this.router.navigate(['/community']);
      }
    });
  }
  uploadVideo() {
    this.postForm.cont = this.cont;
    if (this.videoItem.file) {
      const uploader = new Uploader(this.comm.http, {
        url: '/api/uploadfile',
        file: this.videoItem
      });
      uploader.upload().then(re => {
        console.log(re);
        if (re) {
          if (re['index'] === -1) {
            this.videoItem.msg = '文件已存在';
          } else {
            this.postForm.embed = uploader.md5;
            this.addCircle();
          }
        }
      }).catch(e => {
        this.isSubmitting = false;
        console.log(e);
      });
    } else {
      this.addCircle();
    }
  }
  uploadImage(index: number) {
    if (index >= this.imgItem.length) {
      this.uploadVideo();
      return;
    }
    this.imgItem[index].deletable = false;
    const img = new Image();
    img.src = this.imgItem[index].url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const imgSize = Math.min(img.width, img.height);
      canvas.width = Math.min(imgSize, 512);
      canvas.height = canvas.width;
      const left = (img.width - imgSize) / 2;
      const top = (img.height - imgSize) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        left,
        top,
        imgSize,
        imgSize,
        0,
        0,
        canvas.width,
        canvas.height
      );
      canvas.toBlob(
        (blob: Blob) => {
          this.imgItem[index].msg = '计算hash';
          getMD5(this.imgItem[index].file).then((re: string) => {
            const filename =
              re + '.' + this.imgItem[index].file.type.split('/').pop();
            const form = new FormData();
            form.append('pics', this.imgItem[index].file, filename);
            form.append('pics', blob, re + '_thb.jpeg');
            this.imgItem[index].msg = '上传中';
            this.comm.uploadImages(form).subscribe(re1 => {
              if (re1['status']) {
                this.imgItem[index].msg = '完毕';
                this.postForm.pics.push(re1['path'] + filename);
              }
              this.uploadImage(index + 1);
            });
          });
        },
        'image/jpeg',
        0.9
      );
    };
  }
}
