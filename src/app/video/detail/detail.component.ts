import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScreenService } from 'src/app/screen.service';
import { AuthService } from 'src/app/auth.service';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { VideoService } from '../video.service';

@Component({
  selector: 'mist-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  video: any;
  isSubmitting: boolean;
  currentVideo = 0;
  comments = [];
  comments_owners = [];
  commentForm: FormGroup;
  replyForm = [];
  constructor(
    private route: ActivatedRoute,
    public screen: ScreenService,
    public auth: AuthService,
    private fb: FormBuilder,
    private vs: VideoService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { video: any }) => {
      this.video = data.video;
      console.log(this.video);
      this.commentForm = this.fb.group({
        id: [this.video.id, [Validators.required]],
        text: ['', [Validators.required]],
        type: ['1']
      });
      this.vs.getComments(this.video.id, '1').subscribe(re => {
        console.log(re);
        if (re['owners']) {
          this.comments = re['comments'];
          re['owners'].forEach(ele => {
            if (!this.comments_owners[ele.uid]) {
              this.comments_owners[ele.uid] = ele;
            }
          });
        }
      });
    });
  }
  sendComment(formDirective: FormGroupDirective) {
    this.isSubmitting = true;
    this.vs.comment(this.commentForm.value).subscribe(re => {
      this.isSubmitting = false;
      if (re['status']) {
        this.commentForm.get('text').reset();
        formDirective.resetForm({
          id: this.video.id,
          type: '1'
        });
        this.comments.push(re['doc']);
        this.comments_owners[this.auth.user.uid] = this.auth.user;
      }
    });
  }
  initReply(idx: number, at: string) {
    this.replyForm[idx] = this.replyForm[idx] ? null : {
      form: this.fb.group({
        id: [this.comments[idx].id, [Validators.required]],
        text: ['', [Validators.required]],
        at: [at],
        type: ['reply']
      }),
      isReply: false
    };
  }
  sendReply(idx: number) {
    this.replyForm[idx].isReply = true;
    this.vs.comment(this.replyForm[idx].form.value).subscribe(re => {
      this.replyForm[idx].isReply = false;
      console.log(re);
      if (re['status']) {
        this.replyForm[idx] = null;
        this.comments[idx].reply = this.comments[idx].reply ? this.comments[idx].reply + 1 : 1;
        if (this.comments[idx].replys) {
          this.comments[idx].replys.push(re['doc']);
        } else {
          this.comments[idx].replys = [re['doc']];
        }
        this.comments_owners[this.auth.user.uid] = this.auth.user;
      }
    });
  }
  getReply(idx: number) {
    if (this.comments[idx].replys) {
      this.comments[idx].replys = null;
      return;
    }
    this.comments[idx].isGetReply = true;
    this.vs.getComments(this.comments[idx].id, 'reply').subscribe(re => {
      this.comments[idx].isGetReply = false;
      console.log(re);
      this.comments[idx].replys = re['comments'];
      re['owners'].forEach(ele => {
        if (!this.comments_owners[ele.uid]) {
          this.comments_owners[ele.uid] = ele;
        }
      });
    });
  }
}
