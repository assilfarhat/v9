import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  @Input() submitted: boolean;
  @Input() form: FormGroup;
 
  constructor(private fb: FormBuilder) { }


 
  
 
  
  ngOnInit() {

    
   
  }



  
  get firstName() { return this.form.get('firstName')};
  get lastName() { return this.form.get('lastName')};
  get phoneNumber() { return this.form.get('phoneNumber')};
  get userName() { return this.form.get('userName')};
  
}
