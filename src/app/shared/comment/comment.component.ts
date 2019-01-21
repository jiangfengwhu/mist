import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { SoacService } from 'src/app/soac.service';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'mist-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnDestroy {
  @Input() item: string;
  @Input() type: string;
  comments = [];
  isSubmitting: boolean;
  comments_owners = [];
  hintmsg: string;
  commentForm: FormGroup;
  replyId: number;
  constructor(
    public router: Router,
    public auth: AuthService,
    private fb: FormBuilder,
    private soac: SoacService,
    public msg: MessageService
  ) { }

  ngOnDestroy() {
    this.comments.forEach(ele => {
      ele.replys = null;
    });
  }
  ngOnInit() {
    this.commentForm = this.fb.group({
      id: [this.item, [Validators.required]],
      text: ['', [Validators.required]],
      type: [this.type],
      at: ['']
    });
    this.soac.getComments(this.item, this.type).subscribe(re => {
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
  }
  sendComment(formDirective: FormGroupDirective) {
    this.isSubmitting = true;
    this.soac.comment(this.commentForm.value).subscribe(re => {
      this.isSubmitting = false;
      if (re['status']) {
        this.commentForm.get('text').reset();
        formDirective.resetForm({
          id: this.item,
          type: this.type
        });
        this.hintmsg = '';
        if (this.replyId || this.replyId === 0) {
          this.comments[this.replyId].reply = this.comments[this.replyId].reply ? this.comments[this.replyId].reply + 1 : 1;
          if (this.comments[this.replyId].replys) {
            this.comments[this.replyId].replys.push(re['doc']);
          } else {
            this.comments[this.replyId].replys = [re['doc']];
          }
          this.comments_owners[this.auth.user.uid] = this.auth.user;
          this.replyId = undefined;
        } else {
          this.comments.push(re['doc']);
          this.comments_owners[this.auth.user.uid] = this.auth.user;
        }
      }
    });
  }
  initReply(idx: number, at: string) {
    this.commentForm = this.fb.group({
      id: [this.comments[idx].id, [Validators.required]],
      text: ['', [Validators.required]],
      at: [at],
      type: ['reply']
    });
    this.hintmsg = '回复' + (idx + 1) + '楼' + ' ';
    this.hintmsg += at ? '@' + this.comments_owners[at].nickName : '';
    this.replyId = idx;
  }
  resetReply() {
    this.commentForm = this.fb.group({
      id: [this.item, [Validators.required]],
      text: ['', [Validators.required]],
      type: [this.type],
      at: ['']
    });
    this.replyId = undefined;
    this.hintmsg = '';
  }
  getReply(idx: number) {
    if (this.comments[idx].replys) {
      this.comments[idx].replys = null;
      return;
    }
    this.comments[idx].isGetReply = true;
    this.soac.getComments(this.comments[idx].id, 'reply').subscribe(re => {
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
  like(item: any, type: string) {
    if (item.isliked) {
      item.isliked = 0;
      item.likes = item.likes === 1 ? undefined : item.likes - 1;
    } else {
      item.isliked = 1;
      item.likes = item.likes ? item.likes + 1 : 1;
    }
    this.soac.setLike(item.id, type, item.isliked).subscribe();
  }
  nav(id: string) {
    this.router.navigate(['/user', id]).then(re => {
      if (re && this.msg.dialogRef) {
        this.msg.dialogRef.close();
      }
    });
  }
}
