import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'autolink'
})
export class AutolinkPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const replacer = (p1, p2) => {
      const striped = p1.replace(/\r?\n|\r/g, '').replace(/^\/\/|^.*?:(\/\/)?/, '');
      return (
        p2 +
        '<a href=\'' +
        p1 +
        '\' target=\'_blank\' class="autolinka">' +
        (striped.length > 35 ? striped.slice(0, 35) + '...' : striped) + '</a>'
      );
    };
    return value
      ? value.replace(
          /(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi,
          replacer
        )
      : '';
  }
}
