import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from 'app/services/auth-service.service';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { UserService } from 'app/services/user.service';
import { TokenService } from 'app/services/token.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  form: FormGroup;
  hasError = false;
  errorMessage: string;
  submitted= false;
  lang:any;

  constructor(private userService: UserService,
    private router: Router, private fb: FormBuilder,  private toasterService: ToasterService,private tokenService:TokenService) { }

  ngOnInit() {
   this.lang= this.tokenService.getLang();
    this.form = this.fb.group({
        
      NewPassword : [ '', [ Validators.required,Validators.minLength(6) ]] ,
      OldPassword : [ '', [ Validators.required ]],
      confirm : [ '', [ Validators.required ]]},
       {
        validator: this.MustMatch('NewPassword', 'confirm')
     
    })
  }
  

  changePass( ) {
    this.submitted=true;
    if (this.form.valid){
      this.userService.changePassword(this.form.value).subscribe(
      () => {
        this.router.navigate(['/home']);
      
      },
      (err) =>{
        
        this.hasError = true;
        this.errorMessage = err.error;
        if(this.lang=='en'){
          this.errorMessage="The password is incorrect";
        }

      }
    )
  }
     
    
    
  }
  get f() { return this.form.controls; }
//
 MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

}
