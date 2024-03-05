import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { HttpResponse } from '@aspnet/signalr';
import { HttpEventType } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CompareAmounts, CompareDates, } from 'app/shared/Validators';
import { CarteService } from 'app/services/carte.service';
import { TokenService } from 'app/services/token.service';


@Component({
  selector: 'app-client-historique-recharge',
  templateUrl: './client-historique-recharge.component.html',
  styleUrls: ['./client-historique-recharge.component.scss']
})
export class ClientHistoriqueRechargeComponent implements OnInit {
  constructor(private tokenService: TokenService, private datePipe: DatePipe, private route: ActivatedRoute, private clientService: ClientService, private router: Router, private fb: FormBuilder, private toasterService: ToasterService, private carteSerivce: CarteService) { }

  form: FormGroup;
  withParameter = false
  motifAnnulation = ""
  @ViewChild('ConfirmRechargeModal') ConfirmRechargeModal;
  @ViewChild('EtatRechargeModal') EtatRechargeModal;
  @ViewChild('AnnulerRechargeModal') AnnulerRechargeModal;
  @ViewChild('AnnulerRechargeClientModal') AnnulerRechargeClientModal;
  @ViewChild('AideDecisionModal') AideDecisionModal
  @ViewChild('ReconfirmationRechargeModal') ReconfirmationRechargeModal
  @ViewChild('AnnulerPaiementModal') AnnulerPaiementModal
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  idClient
  progress: number;
  recharge: any;
  dateString: string;
  isDownloading: boolean;
  renisialiser: boolean;
  recherageNonConfirme: any;
  
  ListRechargeClient: any
  ClientList;
  dtOptions: any = {};
  dtTrigger = new Subject();
  params: any;
  cheminImage: string = "";
  operations: any;
  DemandeReglementList: any;
  DisabledButton: boolean = false;
  isMemo: boolean = false;
  accessView: any;
  access: any;
  decision:any;
  ActualUser: string = "";
  accessdecision:any;
  confirmPS:any;
  accessconfirmPS:any;
  typerecharge:any;
  annulation:any;
  accessannulation:any;
  async reinitialiser() {
    this.renisialiser = true
    this.datatable()
    if (this.dtElement) {
      let dtInstance = await this.dtElement.dtInstance;
      if (dtInstance) {
        dtInstance.rows().remove().draw();;
        dtInstance.destroy();
      }
    }
  }
  ngOnInit() {
    this.ActualUser = this.tokenService.getRole();
    this.accessView =this.tokenService.getAccess();

  this.access = JSON.parse(this.accessView).filter(item => item.idAccessView === 'Historique Recharge');
    this.decision = this.access[0].action
   this.accessdecision = this.access[0].valueAccessView
 this.confirmPS = this.access[1].action
   this.accessconfirmPS =this.access[1].valueAccessView
 
   if(this.ActualUser == 'ADMIN STAROIL'){
    console.log("test");
    
    this.access = JSON.parse(this.accessView).filter(item => item.idAccessView === 'Annulation Recharge Confirmé');
this.annulation = this.access[0].action
this.accessannulation = this.access[0].valueAccessView
   }
   
   
   


 
 

    if (this.route.snapshot.paramMap.get('id')) {
      this.idClient = this.route.snapshot.paramMap.get('id')
      this.withParameter = true;
      //console.log('test idClient', this.withParameter)
    }

    this.route.queryParams.subscribe((params) => {
      this.params = params
    });
   // console.log('test idClient2', this.withParameter)

    this.dateString = this.datePipe.transform(new Date(), "yyyy-MM-dd")
    this.form = this.fb.group({
      clientId: [(this.withParameter ? this.idClient : (this.params['clientId'] == undefined ? '' : this.params['clientId']))],
      dateFin: [this.dateString],
      dateDebut: [this.dateString],
      status: [this.params['status'] == undefined ? '' : this.params['status']],
      typeCompte: [this.params['typeCompte'] == undefined ? '' : this.params['typeCompte']],
      typePayement: [this.params['typePayement'] == undefined ? '' : this.params['typePayement']],
      statutBon: [this.params['StatutBon'] == undefined ? '' : this.params['StatutBon']],
      "montantMin": [this.params['montantMin'] == undefined ? '' : this.params['montantMin']],
      "montantMax": [this.params['montantMax'] == undefined ? '' : this.params['montantMax']],
      "numBon": [this.params['numBon'] == undefined ? '' : this.params['numBon']],
      "RaisonSociale": [this.params['RaisonSociale'] == undefined ? '' : this.params['RaisonSociale']],
      typeOperation: [this.params['typeOperation'] == undefined ? '' : this.params['typeOperation']],
      "Date": this.dateString,
      "Montant": "",
      "reference": "",
      numChequeTraite: [this.params['numChequeTraite'] == undefined ? '' : this.params['numChequeTraite']],
      banque: [this.params['banque'] == undefined ? '' : this.params['banque']],
      montantRecharge: [this.params['montantRecharge'] == undefined ? '' : this.params['montantRecharge']],
      codeClient: [this.params['codeClient'] == undefined ? '' : this.params['codeClient']],
      image : [{ value: ''}],  

    },
      {
        validator: [
          CompareAmounts(
            'montantMin'
            , 'montantMax'
          ),
          CompareDates(
            'dateDebut'
            , 'dateFin'
          )
        ]
      })


    this.chargerClientList();
    this.getlistRecharge()
    this.datatable()
  }
  datatable() {
    this.dtOptions = {
      ordering: true,
      pagingType: 'full_numbers',
      dom: 'flBrtip',
      searching: true,
      language: {
        processing: "Traitement en cours...",
        search: "Rechercher&nbsp;:",
        lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
        info: "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty: "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        infoPostFix: "",
        loadingRecords: "Chargement en cours...",
        zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
        emptyTable: "Aucune donn&eacute;e disponible dans le tableau",
        paginate: {
          first: "Premier",
          previous: "Pr&eacute;c&eacute;dent",
          next: "Suivant",
          last: "Dernier"
        },
        aria: {
          sortAscending: ": Activer pour trier la colonne par ordre croissant",
          sortDescending: ": Activer pour trier la colonne par ordre d&eacute;croissant"
        }
      },
      buttons: [
        {
          extend: 'print',
          title: 'Historique recharge des clients'
        }
        ,
        {
          extend: 'excel',
          title: 'Historique recharge des clients'
        }


      ]
    };
  }

  showValidateAnnulationModal() {
    this.AideDecisionModal.hide()
    this.motifAnnulation = ""
    this.AnnulerRechargeModal.show()
    //this.AnnulerRechargeClientModal.show()
  }


  showValidateAnnulationConfirmModal(){

    
this.motifAnnulation = ""
this.AnnulerRechargeClientModal.show()
  }
  chargerDemandeReglementList1() {
    // this.reinitialiser()
    this.clientService.listReglement(this.recharge.idClient).subscribe((
      res: any )=> {
        this.DemandeReglementList = res.filter((result: any) => {
          return (
            result.statusBank == 'En portefeuille' || result.statusBank ==null
          );
        });
        this.AideDecisionModal.show()
        //console.log("demandelste", this.DemandeReglementList);
        //this.AideDecisionModal.show()
      }
    )

  }


  getRechergeNonConfirmerByClientId() {
   //console.log("rechargelist", this.recharge)
    this.clientService.getRechergeNonConfirmerByClientId(this.recharge.idClient, this.recharge.id).subscribe(
      res => {
        this.chargerDemandeReglementList1();
        this.recherageNonConfirme = res as []
        console.log("this.recherageNonConfirme", this.recherageNonConfirme)
        this.AideDecisionModal.show()
      }
    )

  }

  chargerClientList() {
    this.clientService.GetClientsIdName().subscribe(
      res => {
        this.ClientList = res as []
      }
    )
  }
  selectRecharge(item) {
    this.recharge = null
    this.recharge = item
   // console.log(" this.recharge", this.recharge)
    this.cheminImage = "../../../../StaticFiles/FilesStarOil/" + this.recharge.nameFile;
  }
  getlistRecharge() {
    let filtre = JSON.parse(JSON.stringify(this.form.getRawValue()));

    // this.form.value.dateDebut = this.datePipe.transform(this.form.value.dateDebut, "dd/MM/yyyy")
    // this.form.value.dateFin = this.datePipe.transform(this.form.value.dateFin, "dd/MM/yyyy")
    // this.formSearch.value.dateDebut.replace(/-/g, '') ? this.formSearch.value.dateDebut.replace(/-/g, '') : '10000101000000000',
    // this.formSearch.value.dateFin.replace(/-/g, '') ? this.formSearch.value.dateFin.replace(/-/g, '') : '99990101235959999',
    this.router.navigate(['/client/historiqueRecharge'], {
      queryParams: {
        clientId: this.form.getRawValue().clientId,
        dateFin: this.form.value.dateFin,
        dateDebut: this.form.value.dateDebut,
        status: this.form.value.status,
        typeCompte: this.form.value.typeCompte,
        typePayement: this.form.value.typePayement,
        statutBon: this.form.value.statutBon,
        "montantMin": this.form.value.montantMin,
        "montantMax": this.form.value.montantMax,
        "numBon": this.form.value.numBon,
        typeOperation: this.form.value.typeOperation,
        "RaisonSociale": this.form.value.RaisonSociale,
        // "Date":this.dateString,
        // "Montant":"",
        // "reference":""
      }
    });
    
    filtre.dateDebut = this.form.value.dateDebut.replace(/-/g, '') + '000000000' ? this.form.value.dateDebut.replace(/-/g, '') + '000000000' : '10000101000000000';
    filtre.dateFin = this.form.value.dateFin.replace(/-/g, '') + '235959999' ? this.form.value.dateFin.replace(/-/g, '') + '235959999' : '99990101235959999';

    //console.log("hhhhhhhhhhh", filtre);

    this.clientService.GetRechargeClient(filtre).subscribe(
      (res: any) => {
        this.ListRechargeClient = res
        this.typerecharge=this.ListRechargeClient.typeCompte
        console.log("this.ListRechargeClient = res helooo", this.ListRechargeClient)
        this.reinitialiser();
        this.dtTrigger.next();
      })
  }

  // EtatRecharge() {
  //   console.log("id recharge est " + this.recharge.id)
  //   var id = this.recharge.id
  //   this.clientService.GetRechargeData(id).subscribe(
  //     (res: any) => {
  //       console.log(res)
  //       this.toasterService.pop("succèss", "PDf Etat de rechargement téléchargé avec succèss")
  //       this.EtatRechargeModal.hide()
  //      // this.carteSerivce.GetOperationsTransfertRecharge
  //         this.operations = res.listOp;
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
  //         this.printContact("iDdIV2")
  //       }, 1000);
  //     },
  //     (err: any) => {
  //       this.toasterService.pop("error", err.error);
  //     }
  //   )
  // }


  confirmerRecharge() {
    this.DisabledButton = true;
    var confirmation = { id: this.recharge.id, action: 'confirmé' }
    this.clientService.ConfirmerRecharge(confirmation).subscribe(
      (res: any) => {

  console.log('testtt heko',res)

        if (this.ListRechargeClient.find(x => x.id == this.recharge.id).montant < this.ListRechargeClient.find(x => x.id == this.recharge.id).montantRecharge) {
          this.toasterService.pop("success", "le montant de paiement est inférieur au montant de recharge ")
        }
        else
          if (this.ListRechargeClient.find(x => x.id == this.recharge.id).montant > this.ListRechargeClient.find(x => x.id == this.recharge.id).montantRecharge) {
            this.toasterService.pop("success", "le montant de paiement est supérieur au montant de recharge ")
          }
          else
            if (this.ListRechargeClient.find(x => x.id == this.recharge.id).dateEcheance2 != this.ListRechargeClient.find(x => x.id == this.recharge.id).dateEcheance) {
              this.toasterService.pop("success", "La date d’échéance est différente de la date du chèque. ")
            }

        this.toasterService.pop("success", "Pas de dépassement DMA")
        this.toasterService.pop("success", "La confirmation a été effectué avec succèss. ")

        this.ListRechargeClient.find(x => x.id == this.recharge.id).statusValidation = 'confirmé';
        this.ListRechargeClient.find(x => x.id == this.recharge.id).dateTimeValidation = res.result.dateTimeValidation ;
        this.ListRechargeClient.find(x => x.id == this.recharge.id).statutBon = res.result.statutBon;
        this.ListRechargeClient.find(x => x.id == this.recharge.id).montantRechargeRestant = res.result.montantRechargeRestant;
        this.ListRechargeClient.find(x => x.id == this.recharge.id).montantRechargeRestantPPE = res.result.montantRechargeRestantPPE;

        
        this.AideDecisionModal.hide();
        //this.ReconfirmationRechargeModal.hide();

        this.DisabledButton = false;
        setTimeout(() => {
          this.form.patchValue(
            {
              numBon: res.result.bonPayment,
              RaisonSociale: this.ListRechargeClient.find(x => x.id == this.recharge.id).raisonSociale,
              Montant: this.ListRechargeClient.find(x => x.id == this.recharge.id).montant,
              banque: this.ListRechargeClient.find(x => x.id == this.recharge.id).banque,
              typePayement: this.ListRechargeClient.find(x => x.id == this.recharge.id).typePayement,
              numChequeTraite: this.ListRechargeClient.find(x => x.id == this.recharge.id).numChequeTraite,
              montantRecharge: this.ListRechargeClient.find(x => x.id == this.recharge.id).montantRecharge,
              codeClient: this.ListRechargeClient.find(x => x.id == this.recharge.id).cliencodeClienttId,
              statutBon: this.ListRechargeClient.find(x => x.id == this.recharge.id).statutBon,
              reference: res.result.reference
            }
          )
        }, 1000)
        // setTimeout(() => {
        //   this.printContact("iDdIV")
        // }, 1000);
console.log("ikkicfjffn",this.form);

        this.DisabledButton = false;
      },
      (err: any) => {
        this.DisabledButton = false;
        this.toasterService.pop("error", err.error);
        this.AideDecisionModal.hide();
      }
    )
  }

  confirmerPaiement() {
    this.DisabledButton = true;
    var confirmation = { id: this.recharge.id, action: 'confirmé' }
    this.clientService.confirmerPaiement(confirmation).subscribe(
      (res: any) => {
        //this.toasterService.pop("success", "confirmation effectué avec succèss")
        this.ListRechargeClient.find(x => x.id == this.recharge.id).statusValidation = 'confirmé'
        this.ConfirmRechargeModal.hide()
        setTimeout(() => {
          this.form.patchValue(
            {
              numBon: res.result.bonPayment,
              RaisonSociale: this.ListRechargeClient.find(x => x.id == this.recharge.id).raisonSociale,
              Montant: this.ListRechargeClient.find(x => x.id == this.recharge.id).montant,
              reference: res.result.reference
            }
          )
        }, 1000)
        // setTimeout(() => {
        //   this.printContact("iDdIV")
        // }, 1000);
        this.DisabledButton = false;
      },
      (err: any) => {
        this.toasterService.pop("error", err.error);
        this.DisabledButton = false;
      }
    )
  }


  get f() { return this.form.controls };

  printContact(cmpName: any) {
    var divToPrint = document.getElementById(cmpName);
    var newWin = window.open('', 'Print-Window');
    newWin.document.open();
    newWin.document.write('<html><style>table, th, td { border: 1px solid black;border-collapse: collapse; position:relative;border-collapse: collapse;table-layout: fixed; overflow: hidden; width: 100%}</style>')
    newWin.document.write('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
    newWin.document.close();
    setTimeout(function () {
      newWin.close();
    }, 1000);
    newWin.onafterprint = function () {
    }
  }

  download(path: string) {
    this.clientService.download(path).subscribe(
      (res: any) => {
        if (res.resultCode == 0) {
          var divToPrint = document.getElementById("iDdIV");
          var title = "Bon de paiement"
          var newWin = window.open('', 'Print-Window');
          newWin.document.open();
          newWin.document.write('<html><style>table, th, td { border: 1px solid black;border-collapse: collapse; position:relative;border-collapse: collapse;table-layout: fixed; overflow: hidden; width: 100%}</style>')
          newWin.document.write('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
          newWin.document.close();
          setTimeout(function () {
            newWin.close();
          }, 1000);
        } else {
          this.isDownloading = false;
        }
      },
      (err) => {
        this.isDownloading = false;
      })
  }
  onChange() {
    if (this.motifAnnulation == 'Autre') {
      this.isMemo = true;
    }
   // console.log(this.motifAnnulation);
  }
  AnnulerRecharge() {
    if (this.motifAnnulation == '' && this.recharge.typeOperation == "Recharge")
      return

    var confirmation = { id: this.recharge.id, action: 'annulé', motif: this.motifAnnulation }
    this.clientService.AnnulerRecharge(confirmation).subscribe(
      (res: any) => {
        if (res.data.includes("Email non envoyé"))
          this.toasterService.pop("warning", "Annulation effectué avec succèss, Mail non envoyé")
        else
          this.toasterService.pop("success", "Annulation effectué avec succèss")
        this.getlistRecharge();
      },
      (err: any) => {
        this.toasterService.pop("error", "une erreur est survenue");
        this.DisabledButton = false;
      }
    )
  }

  AnnulerRechargeClient(){

    if (this.motifAnnulation == '' && this.recharge.typeOperation == "Recharge")
    return
  var confirmation = { id: this.recharge.id, action: 'annulé', motif: this.motifAnnulation }
  this.clientService.AnnulerRechargeClient(confirmation).subscribe(
    (res: any) => {
      if (res.data.includes("Email non envoyé"))
      {
        this.toasterService.pop("warning", "Annulation effectué avec succèss, Mail non envoyé")
        this.AnnulerRechargeClientModal.hide()
      }
       
       
      else
        this.toasterService.pop("success", "Annulation effectué avec succèss")
      this.getlistRecharge();
      this.AnnulerRechargeClientModal.hide()
    },
    (err: any) => {
      this.toasterService.pop("error", "impossible d'annuler ce recharge ");
      this.AnnulerRechargeClientModal.hide()
    }
  )

  }
}
