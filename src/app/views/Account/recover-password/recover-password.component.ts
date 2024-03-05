import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from 'app/services/token.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  form: FormGroup;
  hasError = false;
  errorMessage: string;
  submitted = false;
  lang='fr';
  constructor(private fb: FormBuilder, private router: Router , private userService : UserService,private tokenService:TokenService) { }

  ngOnInit() {
    this.form = this.fb.group({
        
      usernameOrEmail : [ '', [ Validators.required ]] 
     
    })
  }


  send() {
   this.lang=this.tokenService.getLang();
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.valid) {
    this.userService.recoverPassword(this.form.get('usernameOrEmail').value).subscribe(
      (resp) =>{
        this.router.navigate(['']);
      } 
    ,(err) =>{
    
      this.hasError = true;
      this.errorMessage = err.error;
   if(this.lang=="en"){
     this.errorMessage="User not found !";
   }
      
    } )
  }
   
  }
  get f() { return this.form.controls; }
}
