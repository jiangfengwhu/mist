import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/message.service';
import { ScreenService } from 'src/app/screen.service';
import { GalleryService } from '../gallery.service';
import { Location, ViewportScroller } from '@angular/common';

@Component({
  selector: 'mist-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit, AfterViewInit {
  @ViewChild('body') body: TemplateRef<any>;
  @ViewChild('imgdom') imgdom: ElementRef<HTMLImageElement>;
  ga: any;
  currentIndex = 0;
  constructor(
    private route: ActivatedRoute,
    public _msg: MessageService,
    public screen: ScreenService,
    private gaservice: GalleryService,
    private viewportScroller: ViewportScroller,
    private location: Location
  ) {}

  get imgHeight() {
    return this.imgdom.nativeElement.clientHeight + 'px';
  }
  ngOnInit() {
    this.route.data.subscribe((data: { ga: any }) => {
      this.ga = data.ga;
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this._msg.openDialog(this.body, {
        maxWidth: '100vw',
        panelClass: 'diaborder',
        autoFocus: false,
      });
      this._msg.dialogRef.afterClosed().subscribe(() => {
        this.location.back();
      });
    }, 0);
    this.viewportScroller.scrollToPosition(this.gaservice.scrollPositon);
  }
  next() {
    this.currentIndex =
      this.currentIndex === this.ga.pics.length - 1 ? 0 : this.currentIndex + 1;
  }
  pre() {
    this.currentIndex =
      this.currentIndex === 0 ? this.ga.pics.length - 1 : this.currentIndex - 1;
  }
  like(item: any, type: string) {
    if (item.isliked) {
      item.isliked = 0;
      item.likes = item.likes === 1 ? undefined : item.likes - 1;
    } else {
      item.isliked = 1;
      item.likes = item.likes ? item.likes + 1 : 1;
    }
    this.gaservice.setLike(item.id, type, item.isliked).subscribe();
  }
  openComment(tpl: TemplateRef<any>, id: string) {
    this._msg.openDialog(tpl, {
      data: {
        id: id
      },
      minWidth: 320,
      maxWidth: this.screen.isMobile ? '100vw' : '85vw',
      autoFocus: false
    });
  }
  onSendCom(status: boolean, id: string) {
    if (status) {
      this.ga.comments = this.ga.comments ? this.ga.comments + 1 : 1;
    }
  }
}
