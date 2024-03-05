import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from 'app/services/user.service';
import { TokenService } from 'app/services/token.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ToasterService } from 'angular2-toaster';
import { Router } from '@angular/router';



@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})






export class UpdateProfileComponent implements OnInit {
 
  constructor(private router:Router, private toasterServir:ToasterService, private userService:UserService ,private http:HttpClient, private fb: FormBuilder,private tokenService : TokenService) { 
  }



  form: FormGroup;
  submitted: boolean;
  lang:any;
  private user:any;


  
  ngOnInit() {
this.lang=this.tokenService.getLang();
    this.getUserInfos();

   
    this.form = this.fb.group({
      firstName : ['', [ Validators.required ]] ,
      lastName : ['', [ Validators.required ]],
      email : [ '', [ Validators.required]],
      userName : [ '', [ Validators.required]],
      phoneNumber : [ '', [ Validators.required, Validators.pattern('[1-9][0-9]{7}') ]],
    })

 

   
  }

  getUserInfos() {
    this.http.get(environment.api_url + '/api/Account/Profile'  ).subscribe(
      (resp:any )=>{this.user=resp;
        this.form.patchValue({
          firstName:this.user.firstName,
          lastName:this.user.lastName,
          phoneNumber:this.user.phoneNumber,
          email:this.user.email,
          userName:this.user.userName,
          
        });
      }
    );
  } 

  checkAndSave(){
    this.submitted = true;
    if (this.form.valid) {
     this.userService.updateProfile(this.form.value).subscribe(
       ()=>{
         this.user.firstName=this.form.value.firstName;
         this.user.lastName=this.form.value.lastName;
         this.user.phoneNumber=this.form.value.phoneNumber;
         this.tokenService.setUser(this.user);
          if(this.lang=='fr'){
            this.toasterServir.pop('success', '', 'Votre profil a été modifié avec succès');
          }else{
            this.toasterServir.pop('success', '', 'Your profile has been changed successfully');
          }
         
         this.router.navigate(['/home']);
       },
       () =>{
        if(this.lang=='fr'){
        this.toasterServir.pop('error', '', 'Une erreur est survenue')}
        else{
          this.toasterServir.pop('error', '', 'An error has occurred')
        }
       } 
     )
    }
  }
  get firstName() { return this.form.get('firstName')};
  get lastName() { return this.form.get('lastName')};
  get email() { return this.form.get('email')};
  get userName() { return this.form.get('userName')};
  get phoneNumber() { return this.form.get('phoneNumber')};
  
}
