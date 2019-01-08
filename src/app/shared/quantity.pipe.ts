import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quantity'
})
export class QuantityPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 0) {
      return 0;
    }
    if (value < 1000) {
      return value.toString();
    }
    if (value < 10000) {
      return (value / 1000).toFixed(1).toString() + 'K';
    } else if (value < 100000000) {
      return (value / 10000).toFixed(1).toString() + '万';
    } else {
      return (value / 100000000).toFixed(1).toString() + '亿';
    }
  }

}
