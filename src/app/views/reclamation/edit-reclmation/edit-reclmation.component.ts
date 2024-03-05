import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TokenService } from 'app/services/token.service';

@Component({
  selector: 'app-edit-reclmation',
  templateUrl: './edit-reclmation.component.html',
  styleUrls: ['./edit-reclmation.component.scss']
})
export class EditReclmationComponent implements OnInit {
  @Input() formUpdate: FormGroup;
  @Input() formUpdateIMAGE: FormGroup;
  
  @Input() submitted: boolean;
  pic:any

  roleUser: string = "";
  constructor(private tokenService: TokenService) { }

  ngOnInit() {
    this.roleUser = this.tokenService.getRole();
    ////console.log("heee",this.roleUser)
    //this.pic=this.formUpdate.get('image').value
  }

  get PrenomClient() { return this.formUpdate.get('PrenomClient') };
  get object() { return this.formUpdate.get('object') };
  get Message() { return this.formUpdate.get('Message') };
  get Statut() { return this.formUpdate.get('Statut') };
  
  get image() {return this.formUpdate.get('image').value};
  

  
}
