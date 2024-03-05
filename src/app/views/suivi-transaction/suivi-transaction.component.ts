import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NoteDebitCreditService } from 'app/services/note-debit-credit.service';
import { TokenService } from 'app/services/token.service';
import { DataTableDirective } from 'angular-datatables';
import { SuiviTransactionsService } from 'app/services/suivi-transactions.service';
import { CompareAmounts, CompareDates } from 'app/shared/Validators';
import { ClientService } from 'app/services/client.service';
import { tsXLXS } from 'ts-xlsx-export';
import { AmountpipePipe } from 'app/pipes/amountpipe.pipe';
import { AmountmillierpipePipeVirgule } from 'app/pipes/amountmillierpipeVirgule.pipe';

@Component({
  selector: 'app-suivi-transaction',
  templateUrl: './suivi-transaction.component.html',
  styleUrls: ['./suivi-transaction.component.scss']
})
export class SuiviTransactionComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  lisTransaction: any = [];
  dateString: string;
  form: FormGroup;
  listTransaction = [];

  show = false;
  renisialiser: boolean = false;
  searchTerm: string = '';
  isLoading: boolean = false;
  page: number = 0;
  params: any
  idStation = this.tokenService.getUser().idStation;
  dtOptions: any = {};
  dtTrigger = new Subject();
  ClientList: any = [];
  StationList: any = [];
  transactions: any = [];
  stat: any;
  descriptionCode: any;
  accessView: any;
  access: any;
  telechargement: any;
  ActualUser: string = "";
  accessTelechargement: any;

  confirmPS: any;
  accessconfirmPS: any;
  isLoadingExcel: boolean = false;
  constructor(private clientService: ClientService, private tokenService: TokenService, private fb: FormBuilder, private router: Router, private datePipe: DatePipe, private route: ActivatedRoute, private suiviTransactionsService: SuiviTransactionsService, private toasterService: ToasterService, private amountpipePipe: AmountpipePipe, private amountmillierpipeVirgule: AmountmillierpipePipeVirgule) { }
  
  
  
  ngOnInit() {
    this.ActualUser = this.tokenService.getRole();
    this.accessView = this.tokenService.getAccess();

      this.access = JSON.parse(this.accessView).filter(item => item.idAccessView === 'Transaction');
      this.telechargement = this.access[0].action
      this.accessTelechargement = this.access[0].valueAccessView
      //  this.confirmPS = this.access[1].action
      //  this.accessconfirmPS =this.access[1].valueAccessView


      //console.log("acceessView", this.accessView);
      //console.log("access", this.access);
    
    this.dateString = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.route.queryParams.subscribe((params) => {
      this.params = params
    });


    this.chargerClientList();

    this.chargerStationList();

    this.form = this.fb.group({
      search: "",
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
      "etattransaction": [this.params['etattransaction'] == undefined ? '' : this.params['etattransaction']],
      //"idStationName":[this.params['idStationName'] == undefined ? '' : this.params['idStationName']],

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


    this.getListTransaction()


    this.dtOptions = {
      ordering: true,
      pagingType: 'full_numbers',
      dom: 'flBrtip',
      searching: true,
      //serverSide: false,
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
          title: 'liste des transactions '
        },




      ]
    };

    // let table = $('#example').DataTable({
    //   drawCallback: () => {


    //     console.log("calback")
    //     $('.paginate_button.next')
    //       .on('click', () => {
    //         this.nextButtonClickEvent();
    //       });
    //   }
    // });
  }


  calculePercent(value: number, valueTotal: number) {
    if (valueTotal == 0)
      return 0

    return value / valueTotal * 100
  }






  // rerender(): void {

  // //this.datatable()
  // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  // // Destroy the table first
  // dtInstance.destroy();
  // // Call the dtTrigger to rerender again
  // this.dtTrigger.next();
  // });
  // }




  get f() { return this.form.controls };

  chargerClientList() {
    this.clientService.GetClientsIdName().subscribe(
      res => {
        this.ClientList = res as []
      }
    )
  }

  chargerStationList() {
    this.suiviTransactionsService.GetStationsIdName().subscribe(
      res => {
        this.StationList = res as []
        //console.log("StationList", this.StationList)
      }
    )
  }

  applySearch() {
    // Utilisez la fonction de recherche de DataTables pour filtrer les données
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(this.searchTerm).draw();
    });
  }


  async reinitialiser() {
    if (this.dtElement) {
      let dtInstance = await this.dtElement.dtInstance;
      if (dtInstance) {
        dtInstance.rows().remove().draw();
        dtInstance.destroy();
      }
    }
  }

  getListTransaction() {
    //console.log("testtrann")
    this.isLoading = true
    this.lisTransaction = []
    this.reinitialiser();

    this.suiviTransactionsService.listeTransaction(
      {
        "dateFin": this.form.get("dateFin").value.replace(/-/g, '') ? this.form.get("dateFin").value.replace(/-/g, '') : '99990101',
        "dateDebut": this.form.get("dateDebut").value.replace(/-/g, '') ? this.form.get("dateDebut").value.replace(/-/g, '') : '10000101',
        "status": this.form.get("status").value,
        "typeCompte": this.form.get("typeCompte").value,
        "montantMax": this.form.get("montantMax").value,
        "montantMin": this.form.get("montantMin").value,
        "clientId": this.form.get("clientId").value,
        "NumCarte": this.form.get("NumCarte").value,
        "porteur": this.form.get("porteur").value,
        "etattransaction": this.form.get("etattransaction").value,
        "idStation": this.form.get("idStation").value,

      }
    ).subscribe((resp: any) => {
      this.lisTransaction = resp.data;
      //console.log(this.lisTransaction);

      this.stat = resp
      this.dtTrigger.next();

    }, err => {
      this.isLoading = false;
    });
  }






  exporttoexcel() {
    //console.log("testtrann")
    let expotTransactions: any[] = [];
    this.isLoadingExcel = true;
    this.suiviTransactionsService.exporttoexcelTransaction(
      {
        "dateFin": this.form.get("dateFin").value.replace(/-/g, '') ? this.form.get("dateFin").value.replace(/-/g, '') : '99990101',
        "dateDebut": this.form.get("dateDebut").value.replace(/-/g, '') ? this.form.get("dateDebut").value.replace(/-/g, '') : '10000101',


        "status": this.form.get("status").value,
        "typeCompte": this.form.get("typeCompte").value,
        "montantMax": this.form.get("montantMax").value,
        "montantMin": this.form.get("montantMin").value,
        "clientId": this.form.get("clientId").value,
        "NumCarte": this.form.get("NumCarte").value,
        "porteur": this.form.get("porteur").value,
        "etattransaction": this.form.get("etattransaction").value,
        "idStation": this.form.get("idStation").value,
      }
    ).subscribe((resp: any) => {
      this.transactions = resp.data;

      // console.log("testboutonExport")
      // if(this.transactions.r)
      // if(this.transactions.r)
      this.transactions.forEach(element => {
        var montant = element.montant
        //console.log('listede transactionexcel', element.codeReponse)
        //console.log('listede transactionexcel', element.reversal)
        if (element.reversal == false && element.codeReponse == "00") {
          this.descriptionCode = "Transaction Autorisé"
        }

        if (element.reversal == false && element.codeReponse == "00 ") {
          this.descriptionCode = "Transaction Autorisé"
        }

        if (element.reversal == false && element.codeReponse != "00 ") {
          this.descriptionCode = "Transaction rejeté:" + element.codeReponseDes
        }
        if (element.reversal == true && element.codeReponse != "00 ") {
          this.descriptionCode = "Transaction rejeté:" + + element.codeReponseDes
        }
        if (element.reversal == true && element.codeReponse == "00 ") {
          this.descriptionCode = "Transaction Annulé"
        }


        if (element.reversal == true && element.codeReponse == "00") {
          this.descriptionCode = "Transaction Annulé"
        }

        // if(element.codeReponse !="00" ){
        // this.descriptionCode ="Transaction Rejeté : " 
        // }

        // if(element.codeReponse !="00 "){
        // this.descriptionCode ="Transaction Rejeté : "
        // }

        //console.log("codedescrition", this.descriptionCode)
        // console.log(montant);
        montant = this.amountmillierpipeVirgule.transform(element.montant)
        //console.log('element.montant.amountmillierpipeVirgule', montant);

        expotTransactions.push(
          {
            iDclient: element.idClient,
            client: element.client,
            porteur: element.porteur,
            iDstation: element.idStation,
            nom: element.nom,
            idterminal: element.idterminal,
            numCarte: element.numCarte,
            typeCarte: element.typeCarte,
            numTicket: element.numTicket,
            kilometrage: element.kilometrage,
            produit: element.produit,
            //montant: element.montant.replace('.', ','),
            // this.amoutPipe.montant(element.montantRecharge)
            //montant:this.amountmillierpipeVirgule.transform(element.montant),
            montant: element.montant,

            soldeCarteDispo: element.soldeCarteDispo,
            date: element.date,
            //commision: element.commision,
            codeAutorisation: element.codeAutorisation,

            "Etat de transaction": this.descriptionCode,
          });

      });
      tsXLXS().exportAsExcelFile(expotTransactions).saveAsExcelFile("Liste des transactions ");
      //console.log("progress fin export !! ")
    }, err => {
    });
  }




}