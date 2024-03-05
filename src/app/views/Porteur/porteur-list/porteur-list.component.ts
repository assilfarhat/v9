import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PorteurService } from '../../../services/porteur.service';
import { FormBuilder } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-porteur-list',
  templateUrl: './porteur-list.component.html',
  styleUrls: ['./porteur-list.component.scss']
})
export class PorteurListComponent implements OnInit {
  PorteurList: Object;
    idPorteur: any;
  PorteurForm: any;
   

  constructor(private route: ActivatedRoute, private porteurService: PorteurService, private fb: FormBuilder, private toasterService: ToasterService) { }
  idClient: any;
  ngOnInit() {
    this.idClient = this.route.snapshot.paramMap.get('id');
    
    this.chargerPorteur();
    this.PorteurForm = this.fb.group({
      idPorteur: "",
      montant: 0
    });
  }

  chargerPorteur() {
    this.porteurService.List(this.idClient).subscribe(
      res => {
        this.PorteurList = res
      }
    )
  }
  updatePorteur(id) {
    this.idPorteur = id;
  }
  selectPorteur(id) {
    this.PorteurForm.patchValue({ idPorteur: id, montant: 0 })
  }
  confirmRecharge() {
    this.porteurService.ConfirmeRecharge(this.PorteurForm.value).subscribe(

      (res: any) => {
        // console.log(res);
        this.chargerPorteur();
        this.toasterService.pop("success", res.data);
      },
      (err: any) => {
        // console.log("errr", err);
        this.toasterService.pop("error", err.error);
      }


    )
  }
  
}
