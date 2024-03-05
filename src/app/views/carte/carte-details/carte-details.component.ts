import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { CarteService } from 'app/services/carte.service';
import { TokenService } from 'app/services/token.service';

@Component({
  selector: 'app-carte-details',
  templateUrl: './carte-details.component.html',
  styleUrls: ['./carte-details.component.scss']
})
export class CarteDetailsComponent implements OnInit {
  carte: any = {};
  form: any;
  somme: any;
  carteList: any = [];
  selectedCarte
  ActualUser: string = "";

  accessView: any;
access: any;

miseEnPosition: any;
accessMiseEnPosition: any;
replaceCarte: any;
accessReplaceCarte: any;
renouvelerCarte: any;
accessRenouvelerCarte: any;
PlafondTemporaire:any;
accessPlafondT:any;
  constructor(private tokenService: TokenService, private route: ActivatedRoute, private fb: FormBuilder, private carteService: CarteService, private toasterService: ToasterService) { }
  @ViewChild('ReplaceModal') ReplaceModal;
  @ViewChild('RenouvelmentModal') RenouvelmentModal;
  @ViewChild('ChangerPlafondTemporaire') ChangerPlafondTemporaire
  @ViewChild('MiseEnOppositionModal') MiseEnOppositionModal
  @ViewChild('activateModal') activateModal;

  ngOnInit() {
    this.ActualUser = this.tokenService.getRole();

    
this.accessView = this.tokenService.getAccess();

  this.access = JSON.parse(this.accessView).filter(item => item.idAccessView === 'Carte');
  //this.getlistacces();
  //const carteSubList =this.accessView.filter(item => item.idAccessView === 'Carte');
  this.PlafondTemporaire = this.access[4].action
  this.accessPlafondT = this.access[4].valueAccessView
  this.miseEnPosition = this.access[8].action
  this.accessMiseEnPosition = this.access[8].valueAccessView
  this.replaceCarte = this.access[11].action
  this.accessReplaceCarte = this.access[11].valueAccessView
  this.renouvelerCarte = this.access[12].action
  this.accessRenouvelerCarte = this.access[12].valueAccessView
 
 


  //console.log("acceessView", this.access);
     
    this.form = this.fb.group({
      numCarte: [this.route.snapshot.paramMap.get('id'), Validators.required],
      plafond: ['', Validators.required],
      NbrHeur: ['', Validators.required],
      clientId: ['', Validators.required],
    })
    this.getcarteDetailsById(this.route.snapshot.paramMap.get('id'))

  }

  getcarteDetailsById(id) {
    this.carteService.getcarteDetailsById(id).subscribe((resp: any) => {
      this.carte = resp
      console.log('resp cart', this.carte);
     // console.log('resp cart', resp);
      this.somme = resp.soldePP + resp.soldePPE + resp.plafondPs;
    //  console.log('this.somme', this.somme);


      //console.log('plafonnhorscarb', this.carte.plafondHorsCarburant)
      this.form.controls.clientId.setValue(this.carte.idClient)



    });
  }

  activer() {
    this.carteService.activer(this.route.snapshot.paramMap.get('id')).subscribe(
      res => {
       
        this.getcarteDetailsById(this.route.snapshot.paramMap.get('id'));
        this.activateModal.hide();
        this.toasterService.pop('success', '', 'la carte a été activé avec succès');
       
       
        //   if(this.action=='bloquée')
        //   this.desactivateModal.hide()
        // else  if(this.action=='débloquée')
        //   this.activateModal.hide()
      },
      (err) => {
        this.toasterService.pop('error', '', 'une erreur est servenue');
      }
    )
  }

  changerPlafondTemporaire() {
    this.carteService.changerPlafondTemporaire(this.form.value).subscribe(
      res => {
        this.getcarteDetailsById(this.route.snapshot.paramMap.get('id'));
        this.ChangerPlafondTemporaire.hide();
        this.form = this.fb.group({
          numCarte: [this.route.snapshot.paramMap.get('id'), Validators.required],
          plafond: ['', Validators.required],
          NbrHeur: ['', Validators.required],
          clientId: ['', Validators.required],
        })
        this.toasterService.pop('success', '', 'les plafonds ont été changé avec succès');
        (err) => {
          this.toasterService.pop('error', '', 'une erreur est servenue');

        }
      }
    )
  }

  ReplaceCarte() {
    this.carteService.ReplaceCarte(this.route.snapshot.paramMap.get('id')).subscribe(
      res => {
        this.getcarteDetailsById(this.route.snapshot.paramMap.get('id'));
        this.ReplaceModal.hide();
        this.toasterService.pop('success', '', 'la carte a été remplacée avec succès');
        (err) => {
          this.toasterService.pop('error', '', 'une erreur est servenue');

        }
      }
    )
  }


  MiseEnOppostion() {
    this.carteService.MiseEnOppostion(this.route.snapshot.paramMap.get('id')).subscribe(
      res => {
        this.getcarteDetailsById(this.route.snapshot.paramMap.get('id'));
        this.MiseEnOppositionModal.hide();
        this.toasterService.pop('success', '', 'la carte a été mise en opposition  avec succès');

        (err) => {
          this.toasterService.pop('error', '', 'une erreur est servenue');

        }
      }
    )
  }


  RenouvlerCarte() {
    this.carteService.RenouvlerCarte(this.route.snapshot.paramMap.get('id')).subscribe(
      res => {
        this.getcarteDetailsById(this.route.snapshot.paramMap.get('id'));

        this.RenouvelmentModal.hide();
        this.toasterService.pop('success', '', 'la carte a été renouvelée avec succès');

        (err) => {
          this.toasterService.pop('error', '', 'une erreur est servenue');

        }
      }
    )
  }

}
