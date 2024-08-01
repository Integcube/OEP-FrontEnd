import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({
  name: 'filterBy',
  pure: false
})
export class FilterByPipe implements PipeTransform {
  transform(items: any[], property: string, value: any): any[] {

    if (!items || !property || value === undefined) {
      return items;
    }
    
    return items.filter(item => item[property] === value);
  }
}
