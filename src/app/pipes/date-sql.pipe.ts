import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateSql'
})
export class DateSqlPipe implements PipeTransform {

  transform(value: string): string {
    // 2022 01 27 04:55


    if (typeof value == 'string' && value.indexOf(':')==11) {



      return  value.substr(6, 2) + "-" + value.substr(4, 2) + "-" +  value.substr(0, 4)+ " " +

        value.substr(9, 8)

    }
    if (typeof value == 'string' && value.length>=14) {



      return  value.substr(6, 2) + "-" + value.substr(4, 2) + "-" +  value.substr(0, 4)+ " " +
        // value.substr(6, 2) + ":" +
        value.substr(8, 2) + ":" +
        value.substr(10, 2)+ ":" +
        value.substr(12, 2)
        ;
    }
      else  if (typeof value == 'string' && value.length<=8) {



          return  value.substr(6, 2) + "-" + value.substr(4, 2) + "-" +  value.substr(0, 4)
            ;


      //return value.substr(4, 2) + "/" + value.substr(2, 2) + "/20" + value.substr(0, 2) + " " +
      //  value.substr(6, 2) + ":" +
      //  value.substr(8, 2) + ":" +
      //  value.substr(10, 2)
      //  ;
    }
    return '';
  }

}
