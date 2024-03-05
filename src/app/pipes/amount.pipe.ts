import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amount'
})
export class AmountPipe implements PipeTransform {

  constructor(private _decimalPipe: DecimalPipe) {
 
  
  }
    transform(value: number): any {


      //console.log("Amount pipe value   "  +value)
      
      if ( value && !Number.isNaN(value) && value!=null && value!=undefined ) {
        var formatMontant =this._decimalPipe.transform(value/ 1000, '0.0-3')
        //console.log("Amount after return   "  +formatMontant.replace(new RegExp(',', 'g'), ' ') )
        return formatMontant.replace(new RegExp(',', 'g'), ' ')          ;
      }
      return 0;
    }
  
  }
  