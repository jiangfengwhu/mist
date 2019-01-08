import { Directive, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { FormControlName } from '@angular/forms';
declare var grecaptcha: any;

@Directive({
  selector: '[mistRecaptcha]'
})
export class RecaptchaDirective {
  @Input() recapAction: string;
  constructor(
    private _formControl: FormControlName,
    private _ele: ElementRef,
    private _changeDec: ChangeDetectorRef
  ) {
    const ele: HTMLInputElement = this._ele.nativeElement;
    ele.style.display = 'none';
    grecaptcha.ready(() => {
      this.getCap();
    });
  }
  getCap() {
    grecaptcha
      .execute('6LfY0IIUAAAAAEsgFceYYg0uajVZTriXytnuEcYA', {
        action: this.recapAction
      })
      .then((token: string) => {
        this._formControl.control.setValue(token);
        if (!this._changeDec['destroyed']) {
          this._changeDec.detectChanges();
        }
      });
  }
}
