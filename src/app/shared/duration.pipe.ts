import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value < 60) {
      return '0:0:' + value;
    } else if (value < 3600) {
      return '0:' + Math.floor(value / 60) + ':' + value % 60 ;
    } else {
      return Math.floor(value / 3600) + ':' + Math.floor(value % 3600 / 60) + ':' + value % 3600 % 60;
    }
  }

}
