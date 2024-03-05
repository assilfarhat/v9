import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { CarteService } from 'app/services/carte.service';
import { ClientService } from 'app/services/client.service';
import { ProduitsService } from 'app/services/produits.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AmountPipe } from 'app/pipes/amount.pipe';
import { AmountInputPipe } from 'app/pipes/amount-input-pipe.pipe';

@Component({
  selector: 'app-repartition-plafond',
  templateUrl: './repartition-plafond.component.html',
  styleUrls: ['./repartition-plafond.component.scss']
})
export class RepartitionPlafondComponent implements OnInit {
  formGroupes: FormGroup;
  @Input() client;
  @Input() idClient
  @Input() typeOperation
  plafondDisponible: number = 0;
  soldeInssifisantError: boolean = false;
  constructor(private amountPipe: AmountInputPipe, private route: ActivatedRoute, private router: Router,
    private produitService: ProduitsService, private clientService: ClientService, private fb: FormBuilder, private toasterService: ToasterService, private carteService: CarteService) { }


  ngOnInit() {
    this.formGroupes = this.fb.group({
      groups: this.fb.array([]),
    });
    this.GetAllActivePSCarteByClient()
  }

  GetAllActivePSCarteByClient() {
    this.carteService.GetAllActivePSCarteByClient(this.idClient).subscribe(
      (res: any) => {

        this.client = res.client
        res.cartes.forEach(element => {
          this.addNewGroup(element)
        });
        this.calculatePlafondDispo()
      })

  }


  addNewGroup(model) {
    console.log(model)
    const group = this.fb.group({
      "numCarte": [model.numCarte,],
      "nomPrenom": [model.nomPrenom,],
      "statutCarte": [model.statutCarte,],
      "plafondMensuelInitial": [{ value: (this.typeOperation == 0 ? this.amountPipe.transform(model.plafondMensuelInitial) : this.amountPipe.transform(model.plafondMensuel)), disabled: (this.client.statusPs == "0" ? false : true) || ((this.client.plafondPs != 0 && this.client.plafondPs != null) ? false : true) },],
      descriptionStatus: [model.descriptionStatus,],
    });
    this.groupsForms.push(group)
  }

  get groupsForms() {
    return this.formGroupes.get('groups') as FormArray;
  }

  calculatePlafondDispo() {
    //console.log("calculatePlafondDispo", this.typeOperation, this.client.plafondPsIntial, this.client.plafondPs)
    if (this.typeOperation == 0) {
      let plafondAcalculer = 0
      this.groupsForms.value.forEach(element => {
        if (element.plafondMensuelInitial) {
          plafondAcalculer += Number(element.plafondMensuelInitial)
          //console.log(element.plafondMensuelInitial, plafondAcalculer)
        }
      });
      this.plafondDisponible = (this.client.plafondPSIntial / 1000 - plafondAcalculer) * 1000
    }
    else if (this.typeOperation == 1) {
      let plafondAcalculer = 0
      this.groupsForms.value.forEach(element => {
        if (element.plafondMensuelInitial) {
          plafondAcalculer += Number(element.plafondMensuelInitial)

        }

      });
      this.plafondDisponible = (this.client.plafondPs / 1000 - plafondAcalculer) * 1000
    }
  }

  save() {
    if (this.plafondDisponible < 0) {
      this.soldeInssifisantError = true
      return
    }
    if (this.groupsForms.invalid)
      return
    var model = { idClient: this.client.idClient, cartePlafondPsDTO: this.groupsForms.value, typeOperation: this.typeOperation }
    this.carteService.RepartitionPlafondPS(model).subscribe(async (res: any) => {
      // this.router.navigate(['/client/list']);
      this.toasterService.pop('success', '', "cartes rechargées   avec succès")
    },
      (err) => {
        this.toasterService.pop('error', '', "une erreur est survenue ")
        //console.log(err)
      })

  }

}
