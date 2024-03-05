import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CarteService } from 'app/services/carte.service';
import { ClientService } from 'app/services/client.service';
import { ProduitsService } from 'app/services/produits.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { AmountPipe } from 'app/pipes/amount.pipe';
import { AmountInputPipe } from 'app/pipes/amount-input-pipe.pipe';
import { DatePipe, DecimalPipe, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-recharge-en-mass-carte',
  templateUrl: './recharge-en-mass-carte.component.html',
  styleUrls: ['./recharge-en-mass-carte.component.scss'],

})
export class RechargeEnMassCarteComponent implements OnInit {

  listGroup: any;
  dtTrigger = new Subject();
  dtOptions: any = {};
  form: FormGroup;
  formGroupes: FormGroup;
  selectedgroup
  listeCarte: Array<any> = [];

  @ViewChild('deleteModal') deleteModal;
  @ViewChild('EtatRechargeModal') EtatRechargeModal;
  @ViewChild('ConfirmRechargeModal') ConfirmRechargeModal;
  @ViewChild('AideDecisionModal') AideDecisionModal;
  @ViewChild('ReconfirmationRechargeModal') ReconfirmationRechargeModal;
  user: any = JSON.parse(localStorage.getItem('user'));
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  ClientList = []
  produits: any;
  dropdownSettings: IDropdownSettings = {};
  idClient = this.route.snapshot.paramMap.get('id');
  client: any = {};
  clientACaculer: any;
  soldeInssifisantError = false;
  isDownloading: boolean;
  recharge: any;
  ListRechargeClient: any;
  params: any;
  withParameter = false;
  dateString: string;
  bonRecharge: any;
  RaisonSociale: any;
  Montant: any;
  banque: any;
  typePayment: any;
  numChequeTraite: any;
  codeClient: any;
  etatRecharge: any;
  reference: any;
  datechequesql: any ;
  dateEcheancesql:any;
  form2: FormGroup;
  dateEcheance : any;
  dateCheque : any ;
  montantRecharge: any;
  //numCarte:any;
  ListRechargeClientEtat: any;
  constructor(private _decimalPipe: DecimalPipe, private datePipe: DatePipe, private amountPipe: AmountInputPipe, private route: ActivatedRoute, private router: Router,
    private produitService: ProduitsService, private clientService: ClientService, private fb: FormBuilder, private toasterService: ToasterService, private carteService: CarteService) { }

  ngOnInit() {
    this.dateString = this.datePipe.transform(new Date(), "dd-MM-yyyy")
    this.route.queryParams.subscribe((params) => {
      this.params = params
    });
    //console.log("listede cte :::",this.listeCarte);

    this.form2 = this.fb.group({
      clientId: this.idClient,
      dateFin: '',
      dateDebut: '',
      status: '',
      typeCompte: '',
      typePayment: '',
    })
    let filtre = JSON.parse(JSON.stringify(this.form2.getRawValue()))

    // setTimeout(() => {
    this.clientService.GetRechargeClient(filtre).subscribe(
      (res: any) => {
        this.ListRechargeClient = res
        //console.log("list recharge", this.ListRechargeClient)
      })
    // }, (500));

    this.getClientAndCarteWithSolde();
    this.formGroupes = this.fb.group({
      groups: this.fb.array([]),
     
    });

    //console.log("this.formGroupes amani",this.formGroupes.value.groups )



    this.dropdownSettings = {
      singleSelection: true,
      idField: 'idProduit',
      textField: 'produit',
      selectAllText: 'Sélectionner tout',
      unSelectAllText: 'Désélectionner tout',
      allowSearchFilter: true
    };
    this.form = this.fb.group({

      clientId: [(this.withParameter ? this.idClient : (this.params['id'] == undefined ? '' : this.params['id']))],
      dateFin: [this.params['dateFin'] == undefined ? this.dateString : this.params['dateFin']],
      dateDebut: [this.params['dateDebut'] == undefined ? this.dateString : this.params['dateDebut']],
      status: [this.params['status'] == undefined ? '' : this.params['status']],
      typeCompte: [this.params['typeCompte'] == undefined ? '' : this.params['typeCompte']],
      typePayment: [this.params['typePayment'] == undefined ? '' : this.params['typePayment']],
      // "montantMin": [this.params['montantMin'] == undefined ? '' : this.params['montantMin']],
      // "montantMax": [this.params['montantMax'] == undefined ? '' : this.params['montantMax']],
      "NumBon": [this.params['NumBon'] == undefined ? '' : this.params['NumBon']],
      "RaisonSociale": [this.params['RaisonSociale'] == undefined ? '' : this.params['RaisonSociale']],
      typeOperation: [this.params['typeOperation'] == undefined ? '' : this.params['typeOperation']],
      "Date": this.dateString,
      "Montant": "",
      "reference": "",
      numChequeTraite: [this.params['numChequeTraite'] == undefined ? '' : this.params['numChequeTraite']],
      banque: [this.params['banque'] == undefined ? '' : this.params['banque']],
      montantRecharge: [this.params['montantRecharge'] == undefined ? '' : this.params['montantRecharge']],
      codeClient: [this.params['codeClient'] == undefined ? '' : this.params['codeClient']],
      dateEcheance: [this.params['dateEcheance'] == undefined ? '' : this.params['dateEcheance']],
      dateCheque: [this.params['dateEcheance2'] == undefined ? '' : this.params['dateEcheance2']],

    },
    )
    // console.log("id", this.route.snapshot.paramMap.get('id'))
    this.carteService.getBonRecharge(this.route.snapshot.paramMap.get('id')).subscribe(
      (res: any) => {
        this.bonRecharge = res;
        //console.log("bon recharge", res)
      }
    );

  }

  calculateSoldeDispo(type) {

    if (type == 'PP') {
      var soldeCalcule = 0

      this.groupsForms.value.forEach(element => {
        if (element.montantRecharchePP) {
          soldeCalcule += Number(element.montantRecharchePP)
          // console.log(element.montantRecharchePP, soldeCalcule)
        }
      });
      this.client.soldePP = (this.clientACaculer.soldePP - soldeCalcule * 1000)
      //console.log('this.client.soldePP1',this.client.soldePP);
      //console.log('this.client.soldePP222',this.client.soldePP);
    }
    else if (type == 'PPE') {
      var soldeCalcule = 0

      this.groupsForms.value.forEach(element => {
        if (element.montantRecharchePPE) {
          soldeCalcule += Number(element.montantRecharchePPE)
        }
      });
      this.client.soldePPE = (this.clientACaculer.soldePPE - soldeCalcule * 1000)

    } else if (type == 'PsP') {
      var soldeCalcule = 0

      this.groupsForms.value.forEach(element => {
        if (element.montantRecharchePsP) {
          soldeCalcule += Number(element.montantRecharchePsP)
        }
      });
      this.client.soldePS = (this.clientACaculer.soldePS - soldeCalcule)
    }
  }

  getClientAndCarteWithSolde() {
    this.clientService.getClientCarteWithSolde(this.route.snapshot.paramMap.get('id')).subscribe(
      (res: any) => {
        this.client = res[0]
        this.clientACaculer = JSON.parse(JSON.stringify(res[0]))
        res[1].forEach(element => {
          this.addNewGroup(element)
        });
       // console.log("clientt",this.client)
        //console.log("clientACaculer",this.clientACaculer)
      })
  }

  getCarteWithSolde() {
    this.carteService.GetCartePPByClientWithSolde(this.route.snapshot.paramMap.get('id')).subscribe(
      (res: any) => {
        //console.log(res)
        res.forEach(element => {
          this.addNewGroup(element)
        });
      })
  }

  addNewGroup(model) {
    //console.log((model.statusCartePP == "0" ? false : true), this.client.statusPP, (this.client.statusPP == "0" ? false : true))
    //console.log((model.statusCartePP == "0" ? false : true) || (this.client.statusPP == "0" ? false : true))

    const group = this.fb.group({
      "numCarte": [model.numCarte,],
      "nomPrenom": [model.nomPrenom,],
      "soldeCartePP": [{ value: this._decimalPipe.transform(model.soldeCartePP = 0 ? 0 : model.soldeCartePP / 1000, '1.3-3'), disabled: true }],
      "soldeCartePPE": [{ value: this._decimalPipe.transform(model.soldeCartePPE = 0 ? 0 : model.soldeCartePPE / 1000, '1.3-3'), disabled: true }],
      "soldeCartePsP": [{ value: this._decimalPipe.transform(model.soldeCartePsP = 0 ? 0 : model.soldeCartePsP / 1000, '1.3-3'), disabled: true }],
      "statusCartePP": [model.statusCartePP,],
      "statusCartePPE": [model.statusCartePPE,],
      "statusCartePsP": [model.statusCartePsP,],
      "bonRecharge": [model.bonRecharge,],
      "compteDomestique": [model.compteDomestique,],
      montantRecharchePP: [{ value: 0, disabled: (model.statusCartePP == "0" ? false : true) || (this.client.statusPP == "0" ? false : true) },],
      montantRecharchePPE: [{ value: 0, disabled: (model.statusCartePPE == "0" ? false : true) || (this.client.statusPPE == "0" ? false : true) }],
      montantRecharchePsP: [{ value: 0, disabled: (model.statusCartePsP == "0" ? false : true) || (this.client.statusPsP == "0" ? false : true) }],
    });
    // console.log("groupppnumcarte?", group.value.numCarte)
    // console.log("bonRecharge", group.value.bonRecharge)
    // console.log("montantRecharchePP    " + group.controls.montantRecharchePP.disabled)
    // console.log("groupp")
    this.groupsForms.push(group)
  }


  changeToEditOrDelete(form) {
    form.patchValue({ Action: "update" })
  }

  save(iDdIV) {
    this.listeCarte = this.groupsForms.value;
    this.listeCarte = this.listeCarte.filter(e => e.montantRecharchePP != 0 || e.montantRecharchePPE != 0);
    this.listeCarte.forEach(function (value) {
      //console.log("invalidformaaa",this.groupsForms);
      // console.log("numCarte === " + value.numCarte);
      
      // console.log("montantRecharchePPE === " + value.montantRecharchePPE);
      // console.log("montantRecharchePP === " + value.montantRecharchePP);

      value.montantRecharchePPE = value.montantRecharchePPE = null ? 0 : value.montantRecharchePPE * 1000;
      value.montantRecharchePP = value.montantRecharchePP = null ? 0 : value.montantRecharchePP * 1000;
    });
    //console.log('this.client.soldePP33333',this.client.soldePP);
    //console.log('this.listeCarte',this.listeCarte);
    this.RaisonSociale = this.ListRechargeClient.find(x => x.raisonSociale == this.client.raisonSociale).raisonSociale;
    this.Montant = this.ListRechargeClient.find(x => x.raisonSociale == this.client.raisonSociale).montant;
    this.banque = this.ListRechargeClient.find(x => x.raisonSociale == this.client.raisonSociale).banque;
    this.typePayment = this.ListRechargeClient.find(x => x.raisonSociale == this.client.raisonSociale).typePayment;
    this.numChequeTraite = this.ListRechargeClient.find(x => x.raisonSociale == this.client.raisonSociale).numChequeTraite;
    this.etatRecharge = this.ListRechargeClient.find(x => x.raisonSociale == this.client.raisonSociale).montantRecharge;
    this.codeClient = this.ListRechargeClient.find(x => x.raisonSociale == this.client.raisonSociale).codeClient;
    this.montantRecharge = this.ListRechargeClient.find(x => x.raisonSociale == this.client.raisonSociale).montantRecharge;
    this.dateEcheance = this.ListRechargeClient.find(x => x.raisonSociale == this.client.raisonSociale).dateEcheance;
   // console.log('this.dateEcheance1',this.dateEcheance)
    if( this.dateEcheance !=null){
    // Extraire les composants de la date
    const year = this.dateEcheance.substr(0, 4);
    const month = this.dateEcheance.substr(4, 2);
    const day = this.dateEcheance.substr(6, 2);
    // Formater la date au format "YYYY-MM-DD"
    this.dateEcheancesql = `${day}-${month}-${year}`; 
    //console.log('this.dateEcheance1',this.dateEcheancesql);
    
    }
    this.dateCheque = this.ListRechargeClient.find(x => x.raisonSociale == this.client.raisonSociale).dateEcheance2;
    //console.log('dateCheque',this.datechequesql);
    if( this.dateCheque !=null){
    // Extraire les composants de la date
      const year2 = this.dateCheque.substr(0, 4);
      const month2 = this.dateCheque.substr(4, 2);
      const day2 = this.dateCheque.substr(6, 2);
    // Formater la date au format "YYYY-MM-DD"
    this.datechequesql = `${day2}-${month2}-${year2}`; 
    //console.log('this.dateCheque',this.datechequesql);

  }


    if (this.client.soldePP < 0 || this.client.soldePPE < 0 || this.client.soldePS < 0) {
      this.toasterService.pop('error', '', 'le montant de recharge est supérieur au solde à recharger.')
      return
    }
    //console.log("listede cte :::",this.listeCarte);
    

    // if (this.client.soldePP > 0 || this.client.soldePPE > 0 || this.client.soldePS > 0) {
      // this.toasterService.pop('error', '', 'il faut utiliser tout le solde disponible.')
      // return
    // }
    if ( this.listeCarte.length == 0) {
      this.toasterService.pop('error', '', 'Merci de chargé votre compte.')
      return
    }
    if (this.groupsForms.invalid) {

      //console.log("invalidform");
      return
    }

   
    var model = { NumCompte: this.client.numCompte, idClient: this.client.idClient, recharges: this.listeCarte }
   //console.log("form recharge", model)

    this.carteService.rechargerEnMassCarte(model).subscribe(async (res: any) => {
      setTimeout(() => {
        this.printContact(iDdIV)
      }, 1000);
      this.getListe();
      this.router.navigate(['/client/list']);
      this.toasterService.pop('success', '', "cartes rechargées   avec succès")
    },
      (err) => {
        this.toasterService.pop('error', '', err)
        //console.log(err)
      })
  }

  get groupsForms() {
    return this.formGroupes.get('groups') as FormArray;
  }
  getListe() {
    let s = this.groupsForms.controls as [];
  }
  // EtatRecharge() {
  //   console.log("id recharge est " + this.recharge.id)
  //   var id = this.recharge.id
  //   this.clientService.GetRechargeData(id).subscribe(
  //     (res: any) => {
  //       console.log(res)
  //       this.toasterService.pop("succèss", "PDf Etat de rechargement téléchargé avec succèss")

  //      // this.carteSerivce.GetOperationsTransfertRecharge
  //         //this.operations = res.listOp;
  //       console.log(res)
  //        setTimeout(()=>{
  //         this.form.patchValue(
  //          {

  //             numBon :res.result.bonPayment,
  //            RaisonSociale : this.ListRechargeClient.find(x=>x.id==this.recharge.id).raisonSociale,
  //              Montant: this.ListRechargeClient.find(x=>x.id==this.recharge.id).montant,
  //            reference :res.result.reference,

  //           }
  //         )},1000)
  //       setTimeout(() => {
  //         console.log("Herrrrrre 3")
  //         // this.printContact("iDdIV")
  //         console.log("Herrrrrre 4")
  //       }, 300);
  //     },
  //     (err: any) => {
  //       this.toasterService.pop("error", err.error);
  //     }
  //   )
  // }
  confirmerRecharge() {
    var confirmation = { id: this.recharge.id, action: 'confirmé' }
    this.clientService.ConfirmerRecharge(confirmation).subscribe(
      (res: any) => {
        this.toasterService.pop("success", "confirmation effectué avec succèss")
        this.ListRechargeClient.find(x => x.id == this.recharge.id).statusValidation = 'confirmé'
        this.AideDecisionModal.hide()
        this.ReconfirmationRechargeModal.hide()
        setTimeout(() => {
          this.form.patchValue(
            {
              //bonRecharge: res.result.bonRecharge,
              RaisonSociale: this.ListRechargeClient.find(x => x.id == this.recharge.id).raisonSociale,
              Montant: this.ListRechargeClient.find(x => x.id == this.recharge.id).montant,
              banque: this.ListRechargeClient.find(x => x.id == this.recharge.id).banque,
              typePayment: this.ListRechargeClient.find(x => x.id == this.recharge.id).typePayment,
              numChequeTraite: this.ListRechargeClient.find(x => x.id == this.recharge.id).numChequeTraite,
              montantRecharge: this.ListRechargeClient.find(x => x.id == this.recharge.id).montantRecharge,
              codeClient: this.ListRechargeClient.find(x => x.id == this.recharge.id).cliencodeClienttId,
              reference: res.result.reference,
              dateEcheance :this.ListRechargeClient.find(x => x.id == this.recharge.id).dateEcheance,
              dateCheque : this.ListRechargeClient.find(x => x.id == this.recharge.id).dateCheque,

              

            }
          )
        }, 1000)
        setTimeout(() => {
          // this.printContact("iDdIV")
        }, 300);
      },
      (err: any) => {

        this.toasterService.pop("error", err.error);
      }
    )
  }

  confirmerPaiement() {
    var confirmation = { id: this.recharge.id, action: 'confirmé' }
    this.clientService.confirmerPaiement(confirmation).subscribe(
      (res: any) => {
        this.toasterService.pop("success", "confirmation effectué avec succèss")
        // console.log(this.ListRechargeClient.find(x => x.id == this.recharge.id).statusValidation)
        this.ListRechargeClient.find(x => x.id == this.recharge.id).statusValidation = 'confirmé'
        // console.log(this.ListRechargeClient.find(x => x.id == this.recharge.id))
        //console.log(this.ListRechargeClient.find(x => x.id == this.recharge.id).statusValidation)
        this.ConfirmRechargeModal.hide()
        //console.log(res)
        setTimeout(() => {
          this.form.patchValue(
            {
              NumBon: res.result.bonPayment,
              RaisonSociale: this.ListRechargeClient.find(x => x.id == this.recharge.id).raisonSociale,
              Montant: this.ListRechargeClient.find(x => x.id == this.recharge.id).montant,
              reference: res.result.reference
            }
          )
        }, 1000)
        // setTimeout(() => {
        //   this.printContact("iDdIV")
        // }, 300);
      },
      (err: any) => {
        this.toasterService.pop("error", err.error);
      }
    )
  }
  get f() { return this.form.controls };

  printContact(iDdIV) {
    //  var divToPrint = document.getElementById("iDdIV");
    //console.log("div to print ")
    //console.log(iDdIV)
    var newWin = window.open('', 'Print-Window');
    newWin.document.open();
    newWin.document.write('<html><style>table, th, td { border: 1px solid black;border-collapse: collapse; position:relative;border-collapse: collapse;table-layout: fixed; overflow: hidden; width: 100%}</style>')
    newWin.document.write('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + iDdIV.innerHTML + '</body></html>');
    newWin.document.close();
    setTimeout(function () {
      newWin.close();
    }, 1000);
    newWin.onafterprint = function () {
    }

    // if (newWin.closed){
    //   newWin.document.close();
    // }
  }
  // download(path: string) {
  //   this.clientService.download(path).subscribe(
  //     (res: any) => {
  //       console.log("Result code =" + res.resultCode)
  //       if (res.resultCode == 0) {
  //         var divToPrint = document.getElementById('iddh');
  //         var title = "Bon de paiement"
  //         var newWin = window.open('', 'Print-Window');
  //         document.open();
  //         document.write('<html><style>table, th, td { border: 1px solid black;border-collapse: collapse; position:relative;border-collapse: collapse;table-layout: fixed; overflow: hidden; width: 100%}</style>')
  //         document.write('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
  //         document.close();
  //         setTimeout(function () {
  //           newWin.close();
  //         }, 1000);
  //       } else {
  //         console.log(res)
  //         this.isDownloading = false;
  //       }
  //     },
  //     (err) => {
  //       console.log(err)
  //       this.isDownloading = false;
  //     })
  // }
}
