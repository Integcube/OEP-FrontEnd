import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOnObjBase'
})
export class filterOnObjBase implements PipeTransform {

    transform(items: any[], filterArgs: any): any[] {
        if (!items || !filterArgs) {
          return items;
        }

        return items.filter(item => {
          // Initialize result to true; will remain true if all conditions pass
          let result = true;

          // Check each key in filterArgs
          Object.keys(filterArgs).forEach(key => {
            if (item[key] !== filterArgs[key]) {
              result = false;
            }
          });
    
          return result;
        });
    }
}
