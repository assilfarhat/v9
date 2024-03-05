import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { AmountInputPipe } from 'app/pipes/amount-input-pipe.pipe';
import { CarteService } from 'app/services/carte.service';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-edit-plafond-ps',
  templateUrl: './edit-plafond-ps.component.html',
  styleUrls: ['./edit-plafond-ps.component.scss']
})
export class EditPlafondPSComponent implements OnInit {
  idClient=this.route.snapshot.paramMap.get('id')
  client: any={};
  settings=0
  MoisActuel=1
  constructor( private amountPipe: AmountInputPipe, private route: ActivatedRoute,  private router: Router,
    private clientService : ClientService, private fb: FormBuilder,   private toasterService: ToasterService, private carteService : CarteService) { }
  
  ngOnInit() {
  }




  
}
