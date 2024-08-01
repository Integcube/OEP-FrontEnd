import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  transform(value: any[], field: string, order: string = 'asc'): any[] {
    if (!value || !field || value.length === 0) {
      return value;
    }
    return value.sort((a, b) => {
      if (order === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else if (order === 'desc') {
        return a[field] < b[field] ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
