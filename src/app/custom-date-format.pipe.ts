import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateFormat'
})
export class CustomDateFormatPipe implements PipeTransform {
  transform(dateString: string): string {
    const dateParts = dateString.split(' ')[0]; // Extract the date part
    return `Date Bon : ${dateParts}`;
  }
}
