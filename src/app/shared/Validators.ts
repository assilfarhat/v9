import { FormGroup } from "@angular/forms";

export function CompareAmounts(minAmount: any, maxAmount: any) {
  return (formGroup: FormGroup) => {

    const MinAmount = formGroup.controls[minAmount];
    const MaxAmount = formGroup.controls[maxAmount];


    //console.log(MinAmount.value, MaxAmount.value, Number(MinAmount.value), Number(MaxAmount.value), Number(MinAmount.value) > Number(MaxAmount.value))

    if (MinAmount.value == '' || MaxAmount.value == ''|| MaxAmount.value == null|| MinAmount.value == null){
      MinAmount.setErrors(null);

      return
    }
      

    if (
      MinAmount.errors && !MinAmount.errors.CompareAmounts
      && MaxAmount.errors && !MaxAmount.errors.CompareAmounts
    )
    return;

    if (Number(MinAmount.value) > Number(MaxAmount.value)) {
      MinAmount.setErrors({ CompareAmounts: true })
    }
    else 
    MinAmount.setErrors(null);


  }
}

export function CompareDates(dateDebut: any, dateFin: any) {
  return (formGroup: FormGroup) => {

    const DateDebut = formGroup.controls[dateDebut];
    const DateFin = formGroup.controls[dateFin];


    if (
      DateDebut.errors && !DateDebut.errors.CompareDates
      && DateFin.errors && !DateFin.errors.CompareDates
    )
      return;

    if (new Date(DateDebut.value) > new Date(DateFin.value)) {
      DateDebut.setErrors({ CompareDates: true });
   

    }
    else 
    DateDebut.setErrors(null);
  }
}