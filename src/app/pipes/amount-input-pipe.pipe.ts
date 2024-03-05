import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amountInput'
})
export class AmountInputPipe implements PipeTransform {

  constructor(private _decimalPipe: DecimalPipe) {
 
  
  }
    transform(value: number): string {
    //  console.log("*-------------------------"+value)
      if (typeof value !== 'undefined' ) {
       // console.log(value)
        var formatMontant =this._decimalPipe.transform(value/ 1000, '0.0-3')
       // console.log(formatMontant.replace(new RegExp(',', 'g'), '') )
        return formatMontant.replace(new RegExp(',', 'g'), '')          ;
      }
      return '';
    }
  
  }
  

