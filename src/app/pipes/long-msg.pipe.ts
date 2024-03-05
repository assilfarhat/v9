import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'longMsg'
})
export class LongMsgPipe implements PipeTransform {

  transform(value: string): any {
if(value.length>50)
return value.substr(0,50) +"..."

else return value;


  }

}
