import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'qualityName'
})
export class QualityNamePipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 1:
        return 'Bardzo dobry';
      case 2:
        return 'Dobry';
      case 3:
        return 'Zły';
      default:
        return '-';
    }
   }

}
