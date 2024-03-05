import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToasterService } from 'angular2-toaster';
import { DateSqlPipe } from 'app/pipes/date-sql.pipe';
import { ClientService } from 'app/services/client.service';
import { DemandePersService } from 'app/services/demande-pers.service';
import { TokenService } from 'app/services/token.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-demande-pers',
  templateUrl: './demande-pers.component.html',
  styleUrls: ['./demande-pers.component.scss']
})
export class DemandePersComponent implements OnInit {
  @ViewChild('DemandeParseModal') DemandeParseModal;
  @ViewChild('AnnulerRechargeModal') AnnulerRechargeModal;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  motifAnnulation = ""
  DemandePersList: any;
  DemandePerse: any;
  dtOptions: any = {};
  SelectedClient: string;
  DateDebut: string;
  dtTrigger = new Subject();
  demandePersCarte: any;
  nomPorteur :any;
  lang: any;
  ClientListDropdown: any = [];
  formSearch: FormGroup;
  idClientDrop: string = null;
  params: any;
  dateString: string;
  SelectedIdClient: string;
  SelectedNameClient: string;
  ListdetailCarte: any = [];
  DetailEnteteCarte: any = [];
  selectedFile: any;
  accessView:any;
  access:any;
  ValidationCarte:any;
  accessValidationCarte:any;


  ActualUser: string = "";


  constructor(private fb: FormBuilder, private route: ActivatedRoute, private demandePersService: DemandePersService, private toasterService: ToasterService, private router: Router, private tokenService: TokenService, private clientService: ClientService, private datePipe: DatePipe) {

  }

  ngOnInit() {

    this.ActualUser = this.tokenService.getRole();
    this.accessView = this.tokenService.getAccess();

  this.access = JSON.parse(this.accessView).filter(item => item.idAccessView === 'Validation Carte');
  //this.getlistacces();
  //const carteSubList =this.accessView.filter(item => item.idAccessView === 'Carte');
  this.ValidationCarte = this.access[0].action
  this.accessValidationCarte = this.access[0].valueAccessView
  //console.log("access",this.access);
  
  

    this.route.queryParams.subscribe((params) => {
      this.params = params
    });

    this.lang = this.tokenService.getLang();
    this.dtOptions = {
      ordering: true,
      pagingType: 'full_numbers',
      dom: 'flBrtip',
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
          title: 'liste des demandes Perso '
        },

        {
          extend: 'excel',
          title: 'liste des demandes Perso '
        }

      ]
    };
    this.chargerDemandePersList();
    this.chargerClientListDropdown();
    this.dateString = this.datePipe.transform(new Date(), "yyyy-MM-dd");
   
    this.formSearch = this.fb.group({
      clientId: [this.idClientDrop],
      dateFin: [''],
      dateDebut: [''],
      statut : [this.params['statut'] == undefined ? '' : this.params['statut']],
      dateValidation: [''],
    });
  }

  chargerDemandePersList() {
    this.reinitialiser()
    this.demandePersService.List().subscribe(
      res => {
        this.DemandePersList = res
        //console.log(" this.DemandePersList = res",this.DemandePersList)
        this.dtTrigger.next();
      }
    )
  }

  showValidateAnnulationModal() {
    this.DemandeParseModal.hide()
    this.motifAnnulation = ""
    this.AnnulerRechargeModal.show()
  }

  // AnnulerRecharge() {
  //   console.log("motif"+ this.motifAnnulation)
  //   if(this.motifAnnulation=='' && this.recharge.typeOperation=="Recharge")
  //   return
  //   var confirmation = { id: this.recharge.id, action: 'annulé' , motif: this.motifAnnulation}
  //   this.clientService.AnnulerRecharge(confirmation).subscribe(
  //     (res: any) => {
  //       console.log(res.data.includes("Email non envoyé"), res.data)
  //       if(res.data.includes("Email non envoyé"))
  //         this.toasterService.pop("warning", "Annulation effectué avec succèss, Alert non envoyé")
  //       else
  //       this.toasterService.pop("success", "Annulation effectué avec succèss")
  //       this.ListRechargeClient.find(x => x.id == this.recharge.id).statusValidation = 'annulé'
  //       this.ListRechargeClient.find(x => x.id == this.recharge.id).motifAnnulation = this.motifAnnulation
  //       this.AnnulerRechargeModal.hide()
  //       this.AnnulerPaiementModal.hide()
  //       this.motifAnnulation=''
  //       console.log(res)
  //     },
  //     (err: any) => {
  //       this.toasterService.pop("error", "une erreur est survenue");
  //     }
  //   )
  // }

  selectdemande(item) {

    this.DemandePerse = item
  }


  getCarteByDemande() {
    this.demandePersService.getCarteByDemande(this.DemandePerse.id).subscribe(
      res => {
        this.demandePersCarte = res as []
      this.nomPorteur = this.demandePersCarte.nomPrenom
       //console.log("this.demandePersCarte",this.demandePersCarte)
        this.DemandeParseModal.show()
      }
    )
  }

  ConfrimerDemande() {
    this.demandePersService.ConfrimerDemande(this.DemandePerse.id).subscribe(
      (res: any) => {
        this.DemandePerse.statut = "1"
        this.DemandePerse.dateValidation = res.dateValidation
        this.DemandePerse.validateur = res.validateur
        this.DemandeParseModal.hide()
        this.toasterService.pop('success', '', 'Demande confirmée ! ');
      },
      err => {
        this.toasterService.pop('error', '', "une erreur est survenue")
        this.DemandeParseModal.hide()
      }
    )
   // console.log(" **** confirm demande ***** ")
  }

  AnnulerDemande() {
    this.demandePersService.AnnulerDemande(this.DemandePerse.id).subscribe(
      res => {
        this.DemandePerse.statut = "2"
        this.DemandeParseModal.hide()
        //console.log(this.demandePersCarte)
        this.toasterService.pop('error', '', 'Demande rejetée! ');

       // console.log(" **** rejetée demande ***** ")
      },
      err => {
        this.toasterService.pop('error', '', "une erreur est survenue")
        this.DemandeParseModal.hide()
      }
    )
  }

  chargerClientListDropdown() {
    this.clientService.GetClientsIdName().subscribe(
      res => {
        this.ClientListDropdown = res as [];
      }
    )
  }
  async reinitialiser() {
    if (this.dtElement) {
      let dtInstance = await this.dtElement.dtInstance;
      if (dtInstance) {
        dtInstance.rows().remove().draw();;
        dtInstance.destroy();
      }
    }
  }

  getListeDemandePerso() {
    let search = JSON.parse(JSON.stringify(this.formSearch.value));
   // console.log("before", search);
      search.dateDebut = this.formSearch.value.dateDebut.replace(/-/g, '') ? this.formSearch.value.dateDebut.replace(/-/g, '') : '10000101000000000',
      search.dateFin = this.formSearch.value.dateFin.replace(/-/g, '') ? this.formSearch.value.dateFin.replace(/-/g, '') : '99990101235959999',
      search.dateValidation = this.formSearch.value.dateValidation ? this.formSearch.value.dateValidation.replace(/-/g, ''): '';
    
      //console.log("after", search);
      this.reinitialiser();
      this.demandePersService.ListWithFilter(search).subscribe(
      res => {
        this.DemandePersList = res
        //console.log("this.DemandePersList = res",  this.DemandePersList);
        this.dtTrigger.next();
      }
    )
  }


  async downlaod(file) {

    this.selectedFile = file
    //console.log("this.selectedFile",this.selectedFile)
    var obj = {
      dateActivation: file.dateActivation,
      dateCreation: file.dateCreation,
      idClient : file.codeClient,
      numCarte: file.numCarte,
      raisonSociale : file.raisonSociale,
      typeCarte : file.typeCarte,
      dateValidation  : file.dateValidation,
      nomPrenom : file.nomPrenom,
      //dateUserDmdActivation
      createur : file.createur,
      validateur: file.validateur
      //userDmdActivation
      //userActivation

    }
 
    this.SelectedIdClient = obj.idClient;
    this.SelectedNameClient =obj.raisonSociale;

    //console.log("obj act", obj)
 
    //this.demandePersService.detail(obj.idClient,obj.dateCreation)

    //this.SelectedClient = this.formSearch.get('clientId').value;
    //this.DateDebut = this.formSearch.value.dateDebut.replace(/-/g, '');

    // if (this.SelectedClient == '' || this.SelectedClient == null) {
    //   this.toasterService.pop('error', '', 'Il faut choisir un client');
    // } else {
      //this.SelectedIdClient = this.SelectedClient.substring(0, this.SelectedClient.indexOf(" -"));
      //this.SelectedNameClient = this.SelectedClient.substring(this.SelectedClient.indexOf("- ") + 1, this.SelectedClient.length);
      
      this.demandePersService.detail(obj.idClient,obj.dateCreation).subscribe((resp: any) => {
        let res = resp.result;
        if (res.length == 0) {
          this.toasterService.pop('error', '', 'Rien à imprimer!!! Veuillez accepter au moins une demande.');
        } else {
          this.ListdetailCarte = resp.result;
          this.DetailEnteteCarte = resp.entete;
          //console.log("this.DetailEnteteCarte",this.DetailEnteteCarte)
          setTimeout(() => {
            this.printContact("iDdIV28")
          }, 500);
        }
      });
    //}
  }


 
  




  printContact(cmpName: any) {
    var divToPrint = document.getElementById(cmpName);
    var newWin = window.open('', 'Print-Window');
    newWin.document.open();
    newWin.document.write('<html><style>table, th, td { border: 1px solid black;border-collapse: collapse; position:relative;border-collapse: collapse;table-layout: fixed; overflow: hidden; width: 100%}</style>')
    newWin.document.write('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
    newWin.document.close();
    setTimeout(function () {
      newWin.close();
      this.ListdetailCarte = [];
      this.DetailEnteteCarte = [];
    }, 1000);
    newWin.onafterprint = function () {

    }
  }
}
