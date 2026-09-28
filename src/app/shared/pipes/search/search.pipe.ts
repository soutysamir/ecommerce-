import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(myArray: any[], text: string): unknown {
    return myArray.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
  }
}
