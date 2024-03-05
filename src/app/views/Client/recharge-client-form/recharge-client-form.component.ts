import { Component, OnInit, Inject } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-recharge-client-form',
  templateUrl: './recharge-client-form.component.html',
  styleUrls: ['./recharge-client-form.component.scss']
})
export class RechargeClientFormComponent implements OnInit {

  constructor(private clientService: ClientService, private router: Router, public dialogRef: MatDialogRef<RechargeClientFormComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, private toasterService: ToasterService) { }
  RechargeClientForm: any;

  ngOnInit() {
    this.RechargeClientForm = this.data.form
  }


}
