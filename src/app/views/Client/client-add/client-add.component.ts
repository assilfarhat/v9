import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { AmountInputPipe } from 'app/pipes/amount-input-pipe.pipe';
import { ClientService } from '../../../services/client.service';
import { TokenService } from 'app/services/token.service';

@Component({
  selector: 'app-client-add',
  templateUrl: './client-add.component.html',
  styleUrls: ['./client-add.component.scss']
})
export class ClientAddComponent implements OnInit {
  client = { statut: "0", "typeTax": "Client TTC" }
  clientForm: any;
  editMode = false;
  postPayFlag: boolean;
  resultTest: any;
  echeance: any;
  dmaps: any;
  ActualUser: string = "";
  constructor(private tokenService: TokenService,private amountpipe: AmountInputPipe, private toasterService: ToasterService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private clientService: ClientService) { }

  ngOnInit() {
    this.ActualUser = this.tokenService.getRole();
    this.postPayFlag = false
    if (this.route.snapshot.paramMap.get('id')) {
      // edit
      this.editMode = true;


      this.GetClientByNumCarte()

    }
    //  else {
    //   this.createForm(this.client)

    //   // add
    //   this.editMode = false;
    // }
  }

  GetClientByNumCarte() {
    this.clientService.Get(this.route.snapshot.paramMap.get('id')).subscribe(
      (data: any) => {
        this.client = data.client
        this.createForm(this.client, data.haspostPayé)
       // console.log("plafondps", this.clientForm.controls.plafondPSIntial.value)
       // console.log("psdma", this.clientForm.controls.dmaps.value)
      }
      , err =>
        this.toasterService.pop('error', '', "une erreur est survenue ")

    )
  }

  ModifierClient() {

    //calcul resultat
    this.resultTest = 30 / this.clientForm.controls.echeance.value * this.clientForm.controls.dmaps.value;
    if (this.clientForm.controls.plafondPSIntial.value > this.resultTest) {
      this.toasterService.pop('error', " Le plafond mensuel PS client est supérieur à DMA PS ! ")
    } else {
      this.clientService.Edit(this.clientForm.getRawValue()).subscribe(
        data => {
          if (this.clientForm.controls.plafondPSIntial.value <= this.clientForm.controls.dmaps.value) {
            this.toasterService.pop('success', '', "Le client est modifié avec succès")
            this.router.navigate(['/client/list']);
          }
        },
        err => {
          this.toasterService.pop('error', '', "Une erreur est survenue ! ")
        }
      );

    }
  }

  onChange() {
    if (this.postPayFlag) {
      this.clientForm.get('nbJourAlert').setValidators(Validators.required)
      this.clientForm.get('expirationGrantie').setValidators(Validators.required)
      this.clientForm.get('plafondPSIntial').setValidators(Validators.required)
      this.clientForm.get('dmaps').setValidators(Validators.required)
      this.clientForm.updateValueAndValidity();

    }
    else {
      this.clientForm.get('nbJourAlert').clearValidators()
      this.clientForm.get('expirationGrantie').clearValidators()
      this.clientForm.get('plafondPSIntial').clearValidators()
      this.clientForm.get('dmaps').clearValidators()
      this.clientForm.updateValueAndValidity();

    }


  }


  createForm(model, haspostPayé) {
    if (this.ActualUser != 'VALIDATEUR'){
   
    this.clientForm = this.fb.group({
      "idClient": [{ value: model.idClient, disabled: true }],
      "codeClient": [{ value: model.codeClient, disabled: true }],
      "raisonSociale": [{ value: model.raisonSociale, disabled: true }],
      "adresse": [{ value: model.adresse, disabled: true }],
      "ville": [{ value: model.ville, disabled: true }],
      "codePostal": [{ value: model.codePostal, disabled: true }],
      "contact": [{ value: model.contact, disabled: true }],
      "responsable": [{ value: model.responsable, disabled: true }],
      "telephone": [{ value: model.telephone, disabled: true }],
      "email": [{ value: model.email, disabled: true }],
      nbCarteMax: model.nbCarteMax,
      // "commission": model.commission,
      "nomPerso": [{ value: model.nomPerso, disabled: true }],
      "prixRempCarte": [{ value: model.prixRempCarte, disabled: true }],
      "codeCorePass": [{ value: model.codeCorePass, disabled: true }],
      "actif": [{ value: model.actif, disabled: true }],
      "enOpposition": [{ value: model.enOpposition, disabled: true }],
      "exigerPin": [{ value: model.exigerPin, disabled: true }],
      "plafonne": [{ value: model.plafonne, disabled: true }],
      "cumulable": [{ value: model.cumulable, disabled: true }],
      "dateExpiration": [{ value: model.dateExpiration, disabled: true }],
      "cumul": [{ value: model.cumul, disabled: true }],
      "dateCreation": [{ value: model.dateCreation, disabled: true }],
      "reseauReduit": [{ value: model.reseauReduit, disabled: true }],
      "numCompte": [{ value: model.numCompte, disabled: true }],
      "typeTax": [{ value: model.idClient, disabled: true }],
      "registreCommerce": [{ value: model.registreCommerce, disabled: true }],
      "envoiFacture": model.envoiFacture,
      "typeClient": model.typeClient,
      "accesInternet": model.accesInternet,
      "envoiRLD": model.envoiRLD,
      "remarque": [{ value: model.remarque, disabled: true }],
     
      secteurGeographique: [{ value: model.secteurGeographique, disabled: true }],
      representant: [{ value: model.representant, disabled: true }],
      userName: [model.userName],
      status: [{ value: model.status, disabled: true }],
      secteurActivite: [{ value: model.secteurActivite, disabled: true }],
      plafondPSIntial: [model.plafondPsintial],
      FluxPs: [{ value: model.fluxPs, disabled: (haspostPayé > 0) }],
      echeance: [{ value: model.echeance, disabled: true }],
      dmaps: [{ value: model.dmaps, disabled: true }],
      dMAPPE: [{ value: model.dMAPPE, disabled: true }],
      DMAGlobal: [{ value: model.dmaps, disabled: true }],
      DMAPP: [{ value: model.dMAPP, disabled: true }],
      EncoursGlobal: [{ value: model.encoursGlobal, disabled: true }],
      EncoursPPE: [{ value: model.encoursPPE, disabled: true }],
      EncoursPP: [{ value: model.encoursPP, disabled: true }],
      EncoursPS: [{ value: model.encoursPS, disabled: true }],
      encours: [{ value: model.encours, disabled: true }],
      expirationGrantie: [{ value: model.expirationGrantie, disabled: true }],
      nbJourAlert: [{ value: model.nbJourAlert, disabled: true }],

    
    });
  
    if (!this.editMode) {
      //console.log()
      this.clientForm.get('userName').setValidators(Validators.required)
      this.clientForm.get('userName').updateValueAndValidity();
    }
    else {
      this.clientForm.get('userName').clearValidators()
      this.clientForm.get('userName').updateValueAndValidity();
    }

  }
  if (this.ActualUser == 'VALIDATEUR'){
   
    this.clientForm = this.fb.group({
      "idClient": [{ value: model.idClient, disabled: true }],
      "codeClient": [{ value: model.codeClient, disabled: true }],
      "raisonSociale": [{ value: model.raisonSociale, disabled: true }],
      "adresse": [{ value: model.adresse, disabled: true }],
      "ville": [{ value: model.ville, disabled: true }],
      "codePostal": [{ value: model.codePostal, disabled: true }],
      "contact": [{ value: model.contact, disabled: true }],
      "responsable": [{ value: model.responsable, disabled: true }],
      "telephone": [{ value: model.telephone, disabled: true }],
      "email": [{ value: model.email, disabled: true }],
      nbCarteMax:[{value : model.nbCarteMax,disabled: true }],
      // "commission": model.commission,
      "nomPerso": [{ value: model.nomPerso, disabled: true }],
      "prixRempCarte": [{ value: model.prixRempCarte, disabled: true }],
      "codeCorePass": [{ value: model.codeCorePass, disabled: true }],
      "actif": [{ value: model.actif, disabled: true }],
      "enOpposition": [{ value: model.enOpposition, disabled: true }],
      "exigerPin": [{ value: model.exigerPin, disabled: true }],
      "plafonne": [{ value: model.plafonne, disabled: true }],
      "cumulable": [{ value: model.cumulable, disabled: true }],
      "dateExpiration": [{ value: model.dateExpiration, disabled: true }],
      "cumul": [{ value: model.cumul, disabled: true }],
      "dateCreation": [{ value: model.dateCreation, disabled: true }],
      "reseauReduit": [{ value: model.reseauReduit, disabled: true }],
      "numCompte": [{ value: model.numCompte, disabled: true }],
      "typeTax": [{ value: model.idClient, disabled: true }],
      "registreCommerce": [{ value: model.registreCommerce, disabled: true }],
      "envoiFacture": model.envoiFacture,
      "typeClient": model.typeClient,
      "accesInternet": model.accesInternet,
      "envoiRLD": model.envoiRLD,
      "remarque": [{ value: model.remarque, disabled: true }],
     
      secteurGeographique: [{ value: model.secteurGeographique, disabled: true }],
      representant: [{ value: model.representant, disabled: true }],
      userName: [model.userName],
      status: [{ value: model.status, disabled: true }],
      secteurActivite: [{ value: model.secteurActivite, disabled: true }],
      plafondPSIntial: [{value :model.plafondPsintial, disabled: true }],
      FluxPs: [{ value: model.fluxPs, disabled: (haspostPayé > 0) }],
      echeance: [{ value: model.echeance, disabled: true }],
      dmaps: [{ value: model.dmaps, disabled: true }],
      dMAPPE: [{ value: model.dMAPPE, disabled: true }],
      DMAGlobal: [{ value: model.dmaps, disabled: true }],
      DMAPP: [{ value: model.dMAPP, disabled: true }],
      EncoursGlobal: [{ value: model.encoursGlobal, disabled: true }],
      EncoursPPE: [{ value: model.encoursPPE, disabled: true }],
      EncoursPP: [{ value: model.encoursPP, disabled: true }],
      EncoursPS: [{ value: model.encoursPS, disabled: true }],
      encours: [{ value: model.encours, disabled: true }],
      expirationGrantie: [{ value: model.expirationGrantie, disabled: true }],
      nbJourAlert: [{ value: model.nbJourAlert, disabled: true }],
    
    });
    if (!this.editMode) {
      //console.log()
      this.clientForm.get('userName').setValidators(Validators.required)
      this.clientForm.get('userName').updateValueAndValidity();
    }
    else {
      this.clientForm.get('userName').clearValidators()
      this.clientForm.get('userName').updateValueAndValidity();
    }
  }

  }

  get f() { return this.clientForm.controls };

  changeFluxPS(ob: MatCheckboxChange) {
   // console.log(this.f.FluxPs.value)
    if (ob.checked) {
      this.clientForm.get('expirationGrantie').setValidators(Validators.required)
      this.clientForm.get('expirationGrantie').updateValueAndValidity();
      this.clientForm.get('nbJourAlert').setValidators(Validators.required)
      this.clientForm.get('nbJourAlert').updateValueAndValidity();
      this.clientForm.get('plafondPSIntial').setValidators(Validators.required)
      this.clientForm.get('plafondPSIntial').updateValueAndValidity();
    }
    else {
      this.f.expirationGrantie.setValue(null)
      this.f.plafondPSIntial.setValue(null)
      this.f.nbJourAlert.setValue(null)
      this.clientForm.get('expirationGrantie').clearValidators()
      this.clientForm.get('expirationGrantie').updateValueAndValidity();
      this.clientForm.get('nbJourAlert').clearValidators()
      this.clientForm.get('nbJourAlert').updateValueAndValidity();
      this.clientForm.get('plafondPSIntial').clearValidators()
      this.clientForm.get('plafondPSIntial').updateValueAndValidity();
    }
  }


  AjouterClient() {
    // console.log(" le flag is " + this.postPayFlag)
    // this.clientForm.patchValue({
    //   "actif": this.clientForm.getRawValue().actif ? 1 : 0,
    //   "enOpposition": this.clientForm.getRawValue().enOpposition ? 1 : 0,
    //   "exigerPin": this.clientForm.getRawValue().exigerPin ? 1 : 0,
    //   "plafonne": this.clientForm.getRawValue().plafonne ? 1 : 0,
    //   "cumulable": this.clientForm.getRawValue().cumulable ? 1 : 0,
    //   "reseauReduit": this.clientForm.getRawValue().reseauReduit ? 1 : 0,
    //   "accesInternet": this.clientForm.getRawValue().accesInternet ? 1 : 0,
    //   "envoiFacture": this.clientForm.getRawValue().envoiFacture ? 1 : 0,
    //   envoiRLD: this.clientForm.getRawValue().envoiFacture ? 1 : 0,
    // })
    //if (this.clientForm.invalid) 
    // if (this.clientForm.controls.plafondPSIntial.value > this.clientForm.controls.dmaps.value) {
    //   this.toasterService.pop('error', '', "le plafond mensuel PS client est supérieur à dma PS ")
    // }

    if (this.editMode) {
      this.ModifierClient();
    }
    else {
     // console.log("DMA PS = ", this.clientForm.controls.dmaps.value)
      this.clientService.Add(this.clientForm.getRawValue()).subscribe(
        (data: any) => {
          this.toasterService.pop('success', '', "client ajouté avec succès")
          this.router.navigate(['/carte/add', { id: data.idClient }]);
        },
        err => {
          //console.log(err.error)
         // console.log(err.error == "Code client existant")
          if (err.error == "Code client existant")
            this.toasterService.pop('error', '', "Code client existant")
          else
          //  console.log("DMA PS =", this.clientForm.controls.dmaps.value)
          this.toasterService.pop('error', '', "une erreur est survenue ")

        }
      );



    }

  }





}

