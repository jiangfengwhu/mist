import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {

  constructor(private sanit: DomSanitizer) { }
  transform(value: any, args?: any): any {
    switch (args) {
      case 'html':
        return this.sanit.bypassSecurityTrustHtml(value);
      case 'style':
        return this.sanit.bypassSecurityTrustStyle(value);
      case 'script':
        return this.sanit.bypassSecurityTrustScript(value);
      case 'url':
        return this.sanit.bypassSecurityTrustUrl(value);
      case 'rurl':
        return this.sanit.bypassSecurityTrustResourceUrl(value);
      default:
        return value;
    }
  }

}
