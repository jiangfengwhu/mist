import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let tmp = Math.floor((Date.now() / 1000 - parseInt(value, 10)));
    if (tmp > 0 && tmp < 60) {
      return tmp + '秒前';
    } else if (tmp < 60 * 60) {
      tmp = Math.floor(tmp / 60);
      return tmp + '分钟前';
    } else if (tmp < 3600 * 24) {
      tmp = Math.floor(tmp / 60 / 60);
      return tmp + '小时前';
    } else if (tmp < 3600 * 24 * 30) {
      tmp = Math.floor(tmp / 60 / 60 / 24);
      return tmp + '天前';
    } else if (tmp < 3600 * 24 * 30 * 12) {
      tmp = Math.floor(tmp / 60 / 60 / 24 / 30);
      return tmp + '月前';
    } else {
      tmp = Math.floor(tmp / 60 / 60 / 24 / 30 / 12);
      return tmp + '年前';
    }
  }

}
