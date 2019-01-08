import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numeric'
})
export class NumericPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value === 0) {
      return ' 0 KB';
    } else if (value < 1024) {
      return ' < 1 KB';
    } else if (value < 1024 * 1024) {
      return (value / 1024).toFixed(2) + ' KB';
    } else {
      return (value / 1024 / 1024).toFixed(2) + ' MB';
    }
  }
}
