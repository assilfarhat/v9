import { DecimalPipe} from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'amountmillierpipeVirgule'
})
export class AmountmillierpipePipeVirgule implements PipeTransform {


  constructor(private _decimalPipe: DecimalPipe) {

  }
  transform(value: number): string {
    if (value !== undefined && value !== null) {
      var formatMontant = this._decimalPipe.transform(value / 1000, '1.3-3');
      if (formatMontant == null || formatMontant == undefined)
        return '';
      return formatMontant.replace(new RegExp(',', 'g'), ' ').replace('.', ',');
    }
    return '';
  }
}



