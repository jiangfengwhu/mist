import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VideoService } from '../video.service';
import { ActivatedRoute } from '@angular/router';
import { ScreenService } from 'src/app/screen.service';
import { MessageService } from 'src/app/message.service';
import { Location } from '@angular/common';

@Component({
  selector: 'mist-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  isSubmitting = false;
  tags = [
    {tid: 1, desc: '娱乐'},
    {tid: 2, desc: '游戏'},
    {tid: 3, desc: '日常'},
    {tid: 4, desc: '科教'},
  ];
  video: any;
  infoForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _video: VideoService,
    private route: ActivatedRoute,
    public screen: ScreenService,
    public _msg: MessageService,
    public location: Location
  ) {}

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
}
