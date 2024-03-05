import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateValidite'
})

export class DateValiditePipe implements PipeTransform {
  transform(value: string): string {
    // 2022 01 27 04:55
    if (typeof value == 'string' && value.indexOf(':') == 11) {
      return value.substr(6, 2) + "-" + value.substr(4, 2) + "-" + (Number(value.substr(0, 4)) + 3) + " " + value.substr(9, 8)
    }
    if (typeof value == 'string' && value.length >= 14) {
      return value.substr(6, 2) + "-" + value.substr(4, 2) + "-" + (Number(value.substr(0, 4)) + 3) + " " +
        // value.substr(6, 2) + ":" +
        value.substr(8, 2) + ":" +
        value.substr(10, 2) + ":" +
        value.substr(12, 2)
        ;
    }
    else if (typeof value == 'string' && value.length <= 8) {
      return value.substr(6, 2) + "-" + value.substr(4, 2) + "-" + (Number(value.substr(0, 4)) + 3)
        ;
      //return value.substr(4, 2) + "/" + value.substr(2, 2) + "/20" + value.substr(0, 2) + " " +
      //  value.substr(6, 2) + ":" +
      //  value.substr(8, 2) + ":" +
      //  value.substr(10, 2)
      //  ;
    }
    return '';

    // }
    // return this.dateS;
  }
  // addYears(date, years) {
  //   date.setFullYear(date.getFullYear() + years);
  //   return date;
  // }

  // // May 15, 2022
  // date = new Date('2022-05-15T00:00:00.000Z');

  // newDate = this.addYears(this.date, 3);
}
