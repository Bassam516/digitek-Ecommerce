import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseInt',
  standalone: true
})
export class ParseIntPipe implements PipeTransform {

  transform(value:any): number {
    return parseInt(value);
  }

}
