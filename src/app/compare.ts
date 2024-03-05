import { FormGroup, FormControl } from '@angular/forms';
import { ParseError } from '@angular/compiler';


  
  export function CompareTime(startTime: string, endTime: string) {
   
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[startTime];
      const matchingControl = formGroup.controls[endTime];
  
      if (matchingControl.errors && !matchingControl.errors.compareTime) {
          // return if another validator has already found an error on the matchingControl
          return;
      }
    
      // set error on matchingControl if validation fails

      if (matchingControl.value!=''&&matchingControl.value!=null&&control.value > matchingControl.value ) {
          matchingControl.setErrors({ compareTime: true });
      } else {
          matchingControl.setErrors(null);
      }
    //   if (control.errors && !control.errors.compareDate) {
    //     // return if another validator has already found an error on the matchingControl
    //     return;
    //    }
    //   if (control.value >this.currentDate ) {
    //     control.setErrors({ compareTime: true });
    // } else {
    //   control.setErrors(null);
    //   }
    //   if (matchingControl.errors && !matchingControl.errors.currentDate) {
    //     // return if another validator has already found an error on the matchingControl
    //         return;
    //     }
    // if (matchingControl.value >this.currentDate  ) {
    //   matchingControl.setErrors({ currentTime: true });
    //   } else {
    //       matchingControl.setErrors(null);
    //   }
  }
  }
  export function CompareNumbers(min: string, max: string) {
       
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[min];
        const matchingControl = formGroup.controls[max];
  
        if (matchingControl.errors && !matchingControl.errors.compareNumbers) {
            // return if another validator has already found an error on the matchingControl
            return;
        }
      
        // set error on matchingControl if validation fails
        if (matchingControl.value!=0&&matchingControl.value!=null&& parseInt(control.value) >  parseInt(matchingControl.value) ) {
            matchingControl.setErrors({ compareNumbers: true });
        } else {
            matchingControl.setErrors(null);
        }
     
    }
  }

  export function requiredBy(ref: string,values: string[] ,field: string) {
       
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[ref];
        const matchingControl = formGroup.controls[field];
  
        if (matchingControl.errors && !matchingControl.errors.requiredBy) {
            // return if another validator has already found an error on the matchingControl
            return;
        }
      
        // set error on matchingControl if validation fails
     
        if (values.indexOf(control.value)>-1 && matchingControl.value=='') {

            matchingControl.setErrors({ requiredBy: true });
        } else {
            matchingControl.setErrors(null);
        }
     
    }
  }
  export function requiredFileType(fichier: string, type: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[fichier];
       
        if (control.errors && !control.errors.requiredFileType) {
          // return if another validator has already found an error on the matchingControl
          return;
         }
        const name  =control.value;
        let ext = name.substr((name.length - 3) || 0, 3);
        
          if (ext.toLowerCase()!=type.toLowerCase()) {
          control.setErrors({ requiredFileType: true });
      } else {
        control.setErrors(null);
        }
       
    }
   }
  export function requiredFileTypeWay0( control: FormControl,type: string ) {
    return function () {
      const file = control.value;
      if ( file ) {
        const extension = file.name.split('.')[1].toLowerCase();
        if ( type.toLowerCase() !== extension.toLowerCase() ) {
          return {
            requiredFileType: true
          };
        }
        
        return null;
      }
  
      return null;
    };
  }
