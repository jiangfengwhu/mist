import { Directive, ElementRef, Input, OnDestroy, HostListener } from '@angular/core';
import Cropper from 'cropperjs';
@Directive({
  selector: '[mistCropper]',
  exportAs: 'mistCropper'
})
export class CropperDirective implements OnDestroy {
  @Input() ratio: number;
  @Input() set cropImg(src: string) {
    console.log('img change');
    URL.revokeObjectURL(this.ele.src);
    if (this.cropper) {
      this.cropper.destroy();
    }
    this.ele.src = src;
  }
  ele: HTMLImageElement;
  cropper: Cropper;
  constructor(private eleref: ElementRef) {
    this.ele = this.eleref.nativeElement;
    this.ele.style.maxWidth = '100%';
  }
  ngOnDestroy() {
    console.log('cropper destroy');
    if (this.cropper) {
      this.cropper.destroy();
    }
  }
  createCopper() {
    this.cropper = new Cropper(this.ele, {
      aspectRatio: this.ratio,
      viewMode: 2,
      background: false,
      dragMode: <Cropper.DragMode>'move',
      autoCropArea: 1,
      preview: '#pre'
    });
  }
  getCanvas(width: number, height: number) {
    return this.cropper.getCroppedCanvas({
      width: width || 250,
      height: height || 250
    });
  }
  @HostListener('load') onload() {
    this.createCopper();
  }
}
