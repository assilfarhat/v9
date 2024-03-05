

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { tsXLXS } from 'ts-xlsx-export';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NoteDebitCreditService } from 'app/services/note-debit-credit.service';
import { TokenService } from 'app/services/token.service';
import { DataTableDirective } from 'angular-datatables';
import { SuiviTransactionsService } from 'app/services/suivi-transactions.service';
import { CompareAmounts, CompareDates } from 'app/shared/Validators';
import { ClientService } from 'app/services/client.service';
import { log } from 'console';
import { AmountmillierpipePipeVirgule } from 'app/pipes/amountmillierpipeVirgule.pipe';


@Component({
  selector: 'app-historique-client',
  templateUrl: './historique-client.component.html',
  styleUrls: ['./historique-client.component.scss']
})
export class HistoriqueClientComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  @ViewChild('RechargeModalS') RechargeModalS;


  dateString: string;
  form: FormGroup;
  listTransactionRecharge = []
  showtransaction: boolean = false;
  showRecharge: boolean = false;
  show = false;
  resultTransactionClients: any;
  renisialiser: boolean = false;
  page: number = 0;
  params: any;
  action
  selectedClient
  LogTransactionRecharge = [];
  numCarte: any;
  isLoading: boolean = false;
  idStation = this.tokenService.getUser().idStation;
  dtOptions: any = {};
  dtTrigger = new Subject();
  ClientList: any = [];
  stat: any;
  soldepp: any;
  soldeppe: any;
  soldeps: any;
  somme: any;
  resultRechargeClients: any;
  nbTotalResults: any;


  ActualUser: string = "";
  displayNoDataMessage: boolean;
  NoDataMessage: boolean;
  constructor(private clientService: ClientService,private amountmillierpipeVirgule: AmountmillierpipePipeVirgule, private tokenService: TokenService, private fb: FormBuilder, private router: Router, private datePipe: DatePipe, private route: ActivatedRoute, private suiviTransactionsService: SuiviTransactionsService, private toasterService: ToasterService) { }

  ngOnInit() {
    
    this.dateString = this.datePipe.transform(new Date(), "yyyy-MM-dd")
    this.ActualUser = this.tokenService.getRole();
    this.route.queryParams.subscribe((params) => {
      this.params = params
    });

    // console.log("this.chargerClientList",  this.chargerClientList )
    this.chargerClientList();


    this.form = this.fb.group({
      "dateFin": [this.params['dateFin'] == undefined ? this.dateString : this.params['dateFin']],
      "dateDebut": [this.params['dateDebut'] == undefined ? this.dateString : this.params['dateDebut']],
      "status": [this.params['status'] == undefined ? '' : this.params['status']],
      "typeCompte": [this.params['typeCompte'] == undefined ? '' : this.params['typeCompte']],
      "montantMax": [this.params['montantMax'] == undefined ? '' : this.params['montantMax']],
      "montantMin": [this.params['montantMin'] == undefined ? '' : this.params['montantMin']],
      "idStation": [this.idStation ? this.idStation : (this.params['idStation'] == undefined ? '' : this.params['idStation'])],
      "clientId": [this.params['clientId'] == undefined ? '' : this.params['clientId']],
      "NumCarte": [this.params['NumCarte'] == undefined ? '' : this.params['NumCarte']],
      "porteur": [this.params['porteur'] == undefined ? '' : this.params['porteur']],
      "typeTransaction": [this.params['porteur'] == undefined ? '' : this.params['porteur']],

    }, {
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
    }
    )


    //this.datatable();
    this.getLogTransactionRecharge();


    this.dtOptions = {
      ordering: true,
      pagingType: 'full_numbers',
      dom: 'flBrtip',
      searching: true,
      serverSide: false,
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
          title: 'Historique Client'
        },
       
      ]
    };




  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  calculePercent(value: number, valueTotal: number) {
    if (valueTotal == 0)
      return 0
    return value / valueTotal * 100
  }




  // datatable() {
  //   this.dtOptions = {
  //     destroy: true,
  //     lengthMenu: [[10, 25, 50], [10, 25, 50]],
  //     serverSide: true,
  //     processing: true,
  //     // scrollCollapse: true,
  //     ordering: false,
  //     searching: false,
  //     displayStart: this.renisialiser ? 0 : (this.params['page'] ? this.params['page'] * 10 : 0),
  //     ajax: (dataTablesParameters: any, callback) => {
  //      // console.log(dataTablesParameters)
  //       if (this.renisialiser || Number.isNaN(this.params['page'])) {
  //         this.page = 0
  //         this.renisialiser = false
  //       }
  //       else if ((this.params['page'] != undefined && dataTablesParameters.start == 0))
  //         this.page = this.params['page']
  //       else
  //         this.page = dataTablesParameters.start / dataTablesParameters.length;

  //       let dateFin = this.datePipe.transform(this.form.get("dateFin").value, 'yyyy-MM-dd')
  //       let datedebut = this.datePipe.transform(this.form.get("dateDebut").value, 'yyyy-MM-dd')

  //       if (this.idStation) {
  //         this.router.navigate(['HistoriqueClient'], {
  //           queryParams: {
  //             "page": this.page,
  //             "dateFin": dateFin,
  //             "dateDebut": datedebut,
  //             "status": this.form.get("status").value,
  //             "typeCompte": this.form.get("typeCompte").value,
  //             "montantMax": this.form.get("montantMax").value,
  //             "montantMin": this.form.get("montantMin").value,
  //             "clientId": this.form.get("clientId").value,
  //             "NumCarte": this.form.get("NumCarte").value,
  //             "porteur": this.form.get("porteur").value,
  //           }
  //         })
  //       }
  //       else {
  //         this.router.navigate(['HistoriqueClient'], {
  //           queryParams: {
  //             "page": this.page,
  //             "dateFin": dateFin,
  //             "dateDebut": datedebut,
  //             "status": this.form.get("status").value,
  //             "typeCompte": this.form.get("typeCompte").value,
  //             "montantMax": this.form.get("montantMax").value,
  //             "montantMin": this.form.get("montantMin").value,
  //             "idStation": this.form.get("idStation").value,
  //             "clientId": this.form.get("clientId").value,
  //             "NumCarte": this.form.get("NumCarte").value,
  //             "porteur": this.form.get("porteur").value,
  //           }
  //         })
  //       }

  //       this.suiviTransactionsService.filtreTransactionsRecharges(
  //         {
  //           "page": this.page,
  //           "size": dataTablesParameters.length,
  //           "dateFin": dateFin.replace(/-/g, '') ? dateFin.replace(/-/g, '') : '99990101',
  //           "dateDebut": datedebut.replace(/-/g, '') ? datedebut.replace(/-/g, '') : '10000101',
  //           "status": this.form.get("status").value,
  //           "typeCompte": this.form.get("typeCompte").value,
  //           "montantMax": this.form.get("montantMax").value,
  //           "montantMin": this.form.get("montantMin").value,
  //           "idStation": this.form.get("idStation").value,
  //           "clientId": this.form.get("clientId").value,
  //           "NumCarte": this.form.get("NumCarte").value,
  //           "porteur": this.form.get("porteur").value,
  //         }

  //       ).subscribe((resp: any) => {
  //         //this.listTransactionRecharge = resp.data.concat(resp.dataRecharge).sort((a, b) => a.dateTimeSystem - b.dateTimeSystem);
  //         this.listTransactionRecharge = resp.data;

  //         //this.stat = resp
  //         let recordsFiltred = resp.nbTotalResults
  //         // console.log("this.stat",  this.stat )
  //         // console.log("this.listTransactionRecharge",  this.listTransactionRecharge )


  //         callback({
  //           recordsTotal:  resp.data.countAll,
  //           recordsFiltered: recordsFiltred,
  //           data: []
  //         },
  //           (err) => console.log("err", err));

  //       });
  //     },
  //     language: {
  //       processing: "<div style='position: absolute; z-index: 9999;margin-right: 43%;margin-left: 43%;margin-top:-20px;'></div>",
  //       search: "Rechercher&nbsp;:",
  //       lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
  //       info: "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
  //       infoEmpty: "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
  //       infoFiltered: "",
  //       infoPostFix: "",
  //       loadingRecords: "Chargement en cours...",
  //       zeroRecords: "",
  //       emptyTable: "Aucune donn&eacute;e disponible dans le tableau",
  //       paginate: {
  //         first: "Premier",
  //         previous: "Pr&eacute;c&eacute;dent",
  //         next: "Suivant",
  //         last: "Dernier"
  //       },
  //       aria: {
  //         sortAscending: ": Activer pour trier la colonne par ordre croissant",
  //         sortDescending: ": Activer pour trier la colonne par ordre d&eacute;croissant"
  //       }
  //     },
  //     dom: 'lBrtip',
  //     buttons: [
  //       // 'copy',
  //       // 'print',
  //       // 'excel',
  //       //'colvis'
  //     ]
  //   };
  // }


  getLogTransactionRecharge() {
    //console.log("testtrann")
    
    this.isLoading = true
    this.LogTransactionRecharge = []
    this.reinitialiser();
    let dateFin = this.datePipe.transform(this.form.get("dateFin").value, 'yyyy-MM-dd')
    let datedebut = this.datePipe.transform(this.form.get("dateDebut").value, 'yyyy-MM-dd')

    this.suiviTransactionsService.getLogTransactionRecharge(
      {
        //"dateFin": this.form.get("dateFin").value.replace(/-/g, '') ? this.form.get("dateFin").value.replace(/-/g, '') : '99990101',
        //"dateDebut": this.form.get("dateDebut").value.replace(/-/g, '') ? this.form.get("dateDebut").value.replace(/-/g, '') : '10000101',
        "dateFin": dateFin.replace(/-/g, '') ? dateFin.replace(/-/g, '') : '99990101',
        "dateDebut": datedebut.replace(/-/g, '') ? datedebut.replace(/-/g, '') : '10000101',

        "status": this.form.get("status").value,
        "typeCompte": this.form.get("typeCompte").value,
        "montantMax": this.form.get("montantMax").value,
        "montantMin": this.form.get("montantMin").value,
        "idStation": this.form.get("idStation").value,
        "clientId": this.form.get("clientId").value,
        "NumCarte": this.form.get("NumCarte").value,
        "porteur": this.form.get("porteur").value,
        "typeTransaction": this.form.get("typeTransaction").value,

      }

    ).subscribe((resp: any) => {
      //console.log("gggggg ")

      //console.log("this.resp : ", resp)
      this.LogTransactionRecharge = resp.data;
      //console.log("this.LogTransactionRecharge : ", this.LogTransactionRecharge)

      this.stat = resp
      //console.log(" this.stat : ", this.stat)
      this.dtTrigger.next();
         
         }
       );
  }

  getLogTransactionRechargeEXCEL() {
    //console.log("testtrann")
    let expotExcel: any[] = [];
    this.isLoading = true
    this.LogTransactionRecharge = []
    this.reinitialiser();
    let dateFin = this.datePipe.transform(this.form.get("dateFin").value, 'yyyy-MM-dd')
    let datedebut = this.datePipe.transform(this.form.get("dateDebut").value, 'yyyy-MM-dd')

    this.suiviTransactionsService.getLogTransactionRecharge(
      {
        //"dateFin": this.form.get("dateFin").value.replace(/-/g, '') ? this.form.get("dateFin").value.replace(/-/g, '') : '99990101',
        //"dateDebut": this.form.get("dateDebut").value.replace(/-/g, '') ? this.form.get("dateDebut").value.replace(/-/g, '') : '10000101',
        "dateFin": dateFin.replace(/-/g, '') ? dateFin.replace(/-/g, '') : '99990101',
        "dateDebut": datedebut.replace(/-/g, '') ? datedebut.replace(/-/g, '') : '10000101',

        "status": this.form.get("status").value,
        "typeCompte": this.form.get("typeCompte").value,
        "montantMax": this.form.get("montantMax").value,
        "montantMin": this.form.get("montantMin").value,
        "idStation": this.form.get("idStation").value,
        "clientId": this.form.get("clientId").value,
        "NumCarte": this.form.get("NumCarte").value,
        "porteur": this.form.get("porteur").value,
        "typeTransaction": this.form.get("typeTransaction").value,

      }

    ).subscribe((resp: any) => {
      //console.log("gggggg ")

      //console.log("this.resp : ", resp)
      this.LogTransactionRecharge = resp.data;
      //console.log("this.LogTransactionRecharge : ", this.LogTransactionRecharge)

      this.stat = resp
      //console.log(" this.stat : ", this.stat)
      this.dtTrigger.next();
          
          this.LogTransactionRecharge.forEach(element => {
            expotExcel.push(
              { "Date" : element.dateTimeSystem ,
                "ID client": element.iDclient,
                "Client": element.client,
                "ID Porteur": element.idPorteur,
                "Porteur": element.porteur ,
                "Numéro carte": element.numCarte ,
                "Type carte": element.typeCarte,
                "ID station": element.idStation ,
                "Nom station": element.nomStation ,
                "Numéro ticket": element.numticket
              });
          });
          tsXLXS().exportAsExcelFile(expotExcel).saveAsExcelFile("Historique client");
         }
       );
  }



  
  async reinitialiser() {
    this.showtransaction = false;
    if (this.dtElement) {
      let dtInstance = await this.dtElement.dtInstance;
      if (dtInstance) {
        dtInstance.rows().remove().draw();;
        dtInstance.destroy();
      }
    }
  }

  // rerender(): void {
  //   this.renisialiser = true
  //   //this.datatable()
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     // Destroy the table first
  //     dtInstance.destroy();
  //     // Call the dtTrigger to rerender again
  //     this.dtTrigger.next();
  //   });
  // }

  get f() { return this.form.controls };

  chargerClientList() {
    this.clientService.GetClientsIdName().subscribe(
      res => {
        this.ClientList = res as []
        // console.log("this.ClientList",this.ClientList)
      }
    )
  }



  selectClientTransaction(item: any, action?: string) {
    this.showtransaction = !this.showtransaction
    //this.showRecharge = !this.showRecharge

    this.selectedClient = item;
    this.action = action || 'defaultAction'; 
  }


  selectClientRecharge(item: any, action?: string) {
    //this.showtransaction = !this.showtransaction
    this.showRecharge = !this.showRecharge

    this.selectedClient = item;
    this.action = action || 'defaultAction'; 
  }


//**************************** transactions client *****************************
  getLogDetailClientTransactions(item: any) {

    if (this.showtransaction && this.action === "Transaction") {
     // this.showRecharge = false;
      this.suiviTransactionsService.ListeTransactionClients({
        "clientId": item.iDclient,
        "NumCarte": item.numCarte,
        "porteur": item.porteur,
        "idStation": item.idStation,
      }).subscribe(
        (res: any) => {

          this.resultTransactionClients = res.data;
          this.nbTotalResults = res.nbTotalResults;
          //console.log("resultTransactionClients", this.resultTransactionClients);
          if (!this.resultTransactionClients || this.resultTransactionClients.length === 0) {
            this.displayNoDataMessage = true;
          } else {
            this.displayNoDataMessage = false;
          }
        }
      );


    } 
  }

//**************************** excel transcation *****************************
  getLogDetailClientTransactionsEXCEL(item: any) {
    ///console.log("item",this.selectedClient)
    let expotTransactions: any[] = [];
    if (this.showtransaction && this.action === "Transaction") {
      // this.showRecharge = false;
       this.suiviTransactionsService.ListeTransactionClients({
         "clientId": this.selectedClient.iDclient,
         "NumCarte": this.selectedClient.numCarte,
         "porteur": this.selectedClient.porteur,
         "idStation": this.selectedClient.idStation,
       }).subscribe(
         (res: any) => {
 
           this.resultTransactionClients = res.data;
           this.nbTotalResults = res.nbTotalResults;
           ///console.log("resultTransactionClientsEXCEL", this.resultTransactionClients);
           if (!this.resultTransactionClients || this.resultTransactionClients.length === 0) {
             this.displayNoDataMessage = true;
           } else {
             this.displayNoDataMessage = false;
           }

           this.resultTransactionClients.forEach(element => {

            var montantformat = this.amountmillierpipeVirgule.transform(element.montant)
            var soldeCarteDispoformat = this.amountmillierpipeVirgule.transform(element.soldeCarteDispo)
            var soldeRestantppformat = this.amountmillierpipeVirgule.transform(element.soldeRestantpp)
            var soldeRestantppeformat = this.amountmillierpipeVirgule.transform(element.soldeRestantppe)
            var soldeRestantpsformat = this.amountmillierpipeVirgule.transform(element.soldeRestantps)
            var soldeGlobaleformat = this.amountmillierpipeVirgule.transform(element.soldeGlobale)
            


            expotTransactions.push(
              {               
                "Client" : element.client,
                "Nom porteur"  : element.nomPorteur,
                "Numéro carte" : element.numCarte,
                "Type carte" : element.typeCarte,
                "ID station" : element.idStation,
                "Nom station" : element.nomStation,
                "Produit" : element.produit,
                "ID terminal" : element.idterminal,
                "Numéro ticket" : element.numTicket,
                "Montant" : montantformat,
                "Nom adresse commercant" : element.nomAdresseCommercant,
                "Date transaction" : element.datetransaction,
                "Code autorisation" : element.codeAutorisation,
                "Code reponse": element.codeReponse === '00' ? 'Approuvée' : element.codeReponseDes,
                "kilometrage" : element.kilometrage,
                "Solde carte disponible"  : soldeCarteDispoformat,
                "Solde restant PP"  : soldeRestantppformat,
                "Solde restant PPE"  : soldeRestantppeformat,
                "Solde restant PS"  : soldeRestantpsformat,
                "Solde globale"  : soldeGlobaleformat,
                //"Etat de transaction": this.descriptionCode,
              });
          });
          tsXLXS().exportAsExcelFile(expotTransactions).saveAsExcelFile("Liste des transactions ");
         }
       );
 
 
     } 

  }

//**************************** recharge client *****************************
  getLogDetailClientRecharge(item: any) {

    if (this.showRecharge && this.action === "Recharge") {
     //this.showtransaction =false;
      this.suiviTransactionsService.ListeRechargeClients({
        "clientId": item.iDclient,
        "NumCarte": item.numCarte,
        "porteur": item.porteur,
        "idPorteur": item.idPorteur,
      }).subscribe(
        (res: any) => {
          this.resultRechargeClients = res.data;
          //console.log("resultRechargeClients", this.resultRechargeClients);
          if (!this.resultRechargeClients || this.resultRechargeClients.length === 0) {
            this.NoDataMessage = true;
          } else {
            this.NoDataMessage = false;
          }
        }
      );
    }

  }

//**************************** excel recharge *****************************
  getLogDetailClientRechargeEXCEL(item: any) {
    let expotRecharge: any[] = [];
    if (this.showRecharge && this.action === "Recharge") {
      // this.showRecharge = false;
       this.suiviTransactionsService.ListeRechargeClients({
         "clientId": this.selectedClient.iDclient,
         "NumCarte": this.selectedClient.numCarte,
         "porteur": this.selectedClient.porteur,
         "idPorteur": this.selectedClient.idPorteur,
         
       }).subscribe(
        (res: any) => {
          this.resultRechargeClients = res.data;
          ////console.log("resultRechargeClients", this.resultRechargeClients);
          if (!this.resultRechargeClients || this.resultRechargeClients.length === 0) {
            this.NoDataMessage = true;
          } else {
            this.NoDataMessage = false;
          }

           this.resultRechargeClients.forEach(element => {
            var montantRecharge = this.amountmillierpipeVirgule.transform(element.montantRecharge)
            expotRecharge.push(
              {

                "Date" : element.dateTimeSystem ,
                "ID client" : element.iDclient,
                "Client" : element.client,
                "N° Carte émettrice ": element.numCarteEmetteur,
                "N° Carte réceptrice ": element.numCarteRecp,
                "Porteur": element.porteur,
                "Bon Recharge": element.bonRecharge,
                "Montant recharge": montantRecharge,
                "Type carte": element.typeCarte,
                "Type transaction": element.typeTransaction,
                "Type solde": element.typesolde
                

              });
          });
          tsXLXS().exportAsExcelFile(expotRecharge).saveAsExcelFile("Liste des recharges ");
         }
       );
 
 
     } 

  }




}



