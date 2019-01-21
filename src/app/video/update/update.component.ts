import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { VideoService } from '../video.service';
import { ActivatedRoute } from '@angular/router';
import {
  MatChipList,
  MatChipInputEvent,
} from '@angular/material';
import { ScreenService } from 'src/app/screen.service';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'mist-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  @ViewChild('chipList') chipList: MatChipList;
  @ViewChild('editvideo') editvideo: TemplateRef<any>;
  isSubmitting = false;
  video: any;
  current: number;
  infoForm: FormGroup;
  videoForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _video: VideoService,
    private route: ActivatedRoute,
    public screen: ScreenService,
    public _msg: MessageService
  ) {}

  copy(loc: HTMLInputElement) {
    loc.select();
    document.execCommand('copy');
  }
  createInfo() {
    this.infoForm = this._fb.group({
      title: [this.video.title, [Validators.required]],
      price: [this.video.price, [Validators.required]],
      tags: this._fb.array(this.video.tags, [Validators.required]),
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
  get tagList() {
    return this.infoForm.get('tags') as FormArray;
  }
  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tagList.push(this._fb.control(value.trim()));
      this.tagList.markAsDirty();
    }
    if (this.tagList.controls.length > 0) {
      this.chipList.errorState = false;
    } else {
      this.chipList.errorState = true;
    }
    if (input) {
      input.value = '';
    }
  }
  removeTag(index: number): void {
    if (index >= 0) {
      this.tagList.removeAt(index);
    }
    if (this.tagList.controls.length === 0) {
      this.chipList.errorState = true;
    }
    this.tagList.markAsDirty();
  }
  openEdit(index: number) {
    this.current = index;
    this.videoForm = this._fb.group({
      title: [this.video.videos[index].title, [Validators.required]],
      desc: [this.video.videos[index].desc],
      cid: [this.video.id, [Validators.required]],
      vid: [this.video.videos[index].id, [Validators.required]]
    });
    this._msg.openDialog(this.editvideo, {
      panelClass: this.screen.isMobile ? 'fullscreen' : ''
    });
  }
  updateBasic() {
    this.isSubmitting = true;
    this._video.updateVC(this.infoForm.value).subscribe(() => {
      this.isSubmitting = false;
    });
  }
  updateOne() {
    this.isSubmitting = true;
    this._video.updateVideo(this.videoForm.value).subscribe(() => {
      this.isSubmitting = false;
      this.video.videos[this.current].title = this.videoForm.get('title').value;
      this.video.videos[this.current].desc = this.videoForm.get('desc').value;
      this._msg.dialogRef.close();
    });
  }
  setCover() {
    const form: any = {
      cid: this.video.id,
      path: this.video.videos[this.current].cover
    };
    this.isSubmitting = true;
    this._video.changeCover(form).subscribe((re) => {
      this.isSubmitting = false;
      this._msg.dialogRef.close();
      if (re['status']) {
        this.video.cover = form.path;
      }
    });
  }
  delOne() {
    const tmp = this.video.videos[this.current].cover.split('/');
    this._video.delOne(this.video.videos[this.current].id, this.video.id, tmp[tmp.length - 1]).subscribe(re => {
      if (re['status']) {
        this.video.videos.splice(this.current, 1);
      }
      this._msg.dialogRef.close();
    });
  }
}
