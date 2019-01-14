import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { FormControl } from '@angular/forms';
import { ScreenService } from 'src/app/screen.service';
import { getMD5 } from 'src/app/utils/md5.function';
import { CommunityService } from '../community.service';
import { Router } from '@angular/router';

@Component({
  selector: 'mist-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  cont = new FormControl('');
  postForm = {
    cont: '',
    pics: []
  };
  imgItem = [];
  isSubmitting = false;
  constructor(
    public auth: AuthService,
    public screen: ScreenService,
    private comm: CommunityService,
    private router: Router
  ) { }

  ngOnDestroy() {
    for (let i = 0; i < this.imgItem.length; i++) {
      URL.revokeObjectURL(this.imgItem[i].url);
    }
  }
  ngOnInit() { }
  addFiles(file: FileList) {
    for (let i = 0; i < file.length; i++) {
      this.imgItem.push({
        url: URL.createObjectURL(file[i]),
        file: file[i],
        deletable: true,
        msg: '等待'
      });
    }
  }
  submit() {
    this.isSubmitting = true;
    this.uploadImage(0);
  }
  delete(index: number) {
    URL.revokeObjectURL(this.imgItem[index].url);
    this.imgItem.splice(index, 1);
  }
  addOne() {
    this.postForm.cont = this.cont.value;
    this.comm.addCircle(this.postForm).subscribe(re => {
      this.isSubmitting = false;
      if (re['status']) {
        this.router.navigate(['/community']);
      }
    });
  }
  uploadImage(index: number) {
    if (index >= this.imgItem.length) {
      this.addOne();
      return;
    }
    this.imgItem[index].deletable = false;
    const img = new Image();
    img.src = this.imgItem[index].url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 200;
      canvas.height = 200;
      const imgSize = Math.min(img.width, img.height);
      const left = (img.width - imgSize) / 2;
      const top = (img.height - imgSize) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, left, top, imgSize, imgSize, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob: Blob) => {
          this.imgItem[index].msg = '计算hash';
          getMD5(this.imgItem[index].file).then((re: string) => {
            const form = new FormData();
            form.append('pics', this.imgItem[index].file, re);
            form.append('pics', blob, re + '_thb.jpeg');
            this.imgItem[index].msg = '上传中';
            this.comm.uploadImages(form).subscribe(re1 => {
              if (re1['status']) {
                this.imgItem[index].msg = '完毕';
                this.postForm.pics.push(re1['path'] + re);
              }
              this.uploadImage(index + 1);
            });
          });
        },
        'image/jpeg',
        0.85
      );
    };
  }
}
