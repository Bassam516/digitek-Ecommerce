import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getTwoWords',
  standalone: true
})
export class GetTwoWordsPipe implements PipeTransform {

  transform(title:string): string {
    return title.split(" ").slice(0,2).join(" ");
  }

}
