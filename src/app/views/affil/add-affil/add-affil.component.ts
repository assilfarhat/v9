import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { Router } from '@angular/router';
import { ClientService } from 'app/services/client.service';
import { AffilService } from 'app/services/affil.service';

import { PointService } from 'app/services/point.service';
import { ContratService } from 'app/services/contrat.service';
import { AffilieService } from 'app/services/affilie.service';

@Component({
  selector: 'app-add-affil',
  templateUrl: './add-affil.component.html',
  styleUrls: ['./add-affil.component.scss']
})
export class AddAffilComponent implements OnInit {

  form: FormGroup;
  submitted: boolean;
  isLoading: boolean = false;

  contrats: any = [];
  contratsAff: any = [];
  mccs: any = [];
  constructor(
    private fb: FormBuilder,
    private toasterService: ToasterService,
    private router: Router,
    private affilService: AffilieService,
    private contratService: ContratService,
    private pointService: PointService

  ) { }


  ngOnInit() {
    // this.getMCC();

    this.form = this.fb.group({
      // CodeAffilie : [ '', [ Validators.required ]] ,
      CodeCorePass: ['', [Validators.required]],
      Nom: ['', [Validators.required]],
      Adresse: ['', [Validators.required]],
      Ville: ['', [Validators.required]],
      CodePostal: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      Contact: ['', [Validators.required]],
      Responsable: ['', [Validators.required]],
      // Activite : [ '', [ Validators.required]],
      //Famille : [ '', [ Validators.required]],
      RaisonSocial: ['', [Validators.required]],
      // Groupe : [ '', [ Validators.required ]] ,
      Gouvernorat: ['', [Validators.required]],
      Actif: [''],
      //Decote : [ '', [ Validators.required ,Validators.pattern('[0-9]{1,2}'),Validators.max(10)]],

      //VisibilieMobile : [ ''] ,
    })



  }// end ngOnInit


  //
  checkAndSave() {

    this.submitted = true;

    if (!this.form.valid)
      return false;

    let form = this.form.value;
    form.Actif == true ? form.Actif = 1 : form.Actif = 0;

    form.VisibilieMobile == true ? form.VisibilieMobile = 1 : form.VisibilieMobile = 0;
    form.listOfContratClient = this.contratsAff;


    //console.log("form",form);

    this.isLoading = !this.isLoading;

    this.affilService.add(form).subscribe((resp: any) => {
      //console.log("resp",resp);
      this.isLoading = !this.isLoading;
      //console.log(resp)
      if (resp.resultCode == 0) {
        this.router.navigate(['/affilation/list'])
        this.toasterService.pop('success', '', 'L affilié a été créé avec succès');
      } else {
        this.toasterService.pop('error', '', 'Une erreur est survenue');

      }

    },
      () => {
        this.isLoading = !this.isLoading;

        this.toasterService.pop('error', '', 'Une erreur est survenue');
      });
  }// end checkAndSave

  getContrats() {
    this.contratService.getAll().subscribe((resp: any) => {
      this.contrats = resp.listOfContrat;

    },
      (err) => {

      });
  }

  
  setContrat(idContrat) {
    let index = 0;

    if (idContrat != "")
      index = this.contratsAff.find(c => c.IdContrat == idContrat);

    //console.log("idContrat",idContrat)

    //console.log("index",index)
    if (index == undefined) {
      let contrat = this.contrats.find(c => c.IdContrat == idContrat);
      this.contratsAff.push({ "IdContrat": idContrat, "Type": contrat.TypeContrat });
    }
    //console.log("this.contratsAff set",this.contratsAff)
  }
  deleteContrat(contrat) {
    //console.log("i",contrat)
    //let index = this.contratsAff.find(c=>c.Type==typeContrat);
    if (contrat > -1) {
      this.contratsAff.splice(contrat, 1);
    }
    //console.log("this.contratsAff delete",this.contratsAff)

  }



  // getMCC(){
  //   this.pointService.getMCC().subscribe((resp:any)=>{
  //     //console.log(resp)
  //   this.mccs=resp.listOfMcc;
  //   //console.log(this.mccs)
  //   })
  //   }


  get f() { return this.form.controls; }

}// end class
