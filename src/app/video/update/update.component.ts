import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VideoService } from '../video.service';
import { ActivatedRoute } from '@angular/router';
import { ScreenService } from 'src/app/screen.service';
import { MessageService } from 'src/app/message.service';
import { Location } from '@angular/common';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'mist-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  isSubmitting = false;
  video: any;
  infoForm: FormGroup;
  subtitle$: any;
  constructor(
    private _fb: FormBuilder,
    public _video: VideoService,
    private route: ActivatedRoute,
    public screen: ScreenService,
    public _msg: MessageService,
    public location: Location
  ) { }

  copy(loc: HTMLInputElement) {
    loc.select();
    document.execCommand('copy');
  }
  createInfo() {
    this.infoForm = this._fb.group({
      title: [this.video.title, [Validators.required]],
      tag: [this.video.tag, [Validators.required]],
      desc: [this.video.desc],
      id: [this.video.id, [Validators.required]]
    });
  }
  ngOnInit() {
    this.route.data.subscribe((data: { video: any }) => {
      this.video = data.video;
      this.createInfo();
    });
  }
  updateBasic() {
    this.isSubmitting = true;
    this._video.updateVC(this.infoForm.value).subscribe(() => {
      this.isSubmitting = false;
    });
  }
  openPreview(loc: string, tpl: any) {
    this.subtitle$ = this._video.getSub(loc);
    this._msg.openDialog(tpl, {
      maxHeight: '80vh'
    });
  }
  removeSub(loc: string) {
    return this._video.delSub({ id: this.video.id, sub: loc }).pipe(
      tap(re => {
        if (re['status']) {
          this.video.subtitle.splice(this.video.subtitle.indexOf(loc), 1);
        }
      })
    );
  }
  addSub(files: FileList) {
    this.isSubmitting = true;
    const form = new FormData();
    form.append('vid', this.video.id);
    form.append('blob', files[0], this.video.id);
    this._video.addSub(form).subscribe(re => {
      this.isSubmitting = false;
      if (re['status']) {
        if (this.video.subtitle) {
          if (this.video.subtitle.indexOf(re['sub']) === -1) {
            this.video.subtitle.push(re['sub']);
          }
        } else {
          this.video.subtitle = [re['sub']];
        }
      }
      console.log(re);
    });
  }
}
