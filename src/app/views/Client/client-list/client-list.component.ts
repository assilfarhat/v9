import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { log } from 'util';
import { MatDialog } from '@angular/material/dialog';
import { RechargeClientFormComponent } from '../recharge-client-form/recharge-client-form.component';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { TokenService } from 'app/services/token.service';
import { CompareDates } from 'app/shared/Validators';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  clienttobeBlocked: any = {};
  @ViewChild('desactivateModal') desactivateModal;
  @ViewChild('DetailModal') DetailModal;
  @ViewChild('BloquerModal') BloquerModal;
  @ViewChild('activateModal') activateModal;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  statusPP: boolean;
  statusPPE: boolean;
  statusPsP: boolean;
  idClient: any;
  selectedClient: any;
  params: any;
  idClientDrop: string = "";
  ClientList: any
  RechargeClientForm: any
  formSearch: FormGroup;
  dtOptions: any = {};
  dtTrigger = new Subject();
  ActualUser: string = "";
  isLoading: boolean = false;
  
  ClientListDropdown: any = [];
  StatusListDropdown: any = ["Actif", "Inactif"];
  accessView: any;
  access: any;
  bloquerFlux:any;
  accessBloquerFlux:any;
  DetailClient :any;
  accessDetail:any;
  historiqueRecharge:any;
  accessHistrique:any;
  iformationClient:any;
  accessIformation:any;
  carteListe:any;
  accessCarteListe:any;
  modifClient:any;
  accessModifClient:any;
  paielentFacture:any;
  accessPaiementFac:any;
  paramPS:any;
  accessParamPs:any;
  rechargeCarte:any;
  accessRecharge:any;
  rechargeClient:any;
  accessRechargeClient:any;

  constructor(private userService: UserService,private tokenService: TokenService, public dialog: MatDialog, private clientService: ClientService, private router: Router, private fb: FormBuilder, private toasterService: ToasterService) { }

  ngOnInit() {
    this.ActualUser = this.tokenService.getRole();
    this.accessView =this.tokenService.getAccess();
    
      this.access = JSON.parse(this.accessView).filter(item => item.idAccessView === 'Client');

       this.bloquerFlux = this.access[0].action
       this.accessBloquerFlux = this.access[0].valueAccessView
       this.DetailClient = this.access[1].action
       this.accessDetail = this.access[1].valueAccessView
       this.historiqueRecharge = this.access[2].action
       this.accessHistrique = this.access[2].valueAccessView
       this.iformationClient = this.access[3].action
       this.accessIformation = this.access[3].valueAccessView
       this.carteListe = this.access[4].action
       this.accessCarteListe = this.access[4].valueAccessView
      this.modifClient = this.access[5].action
      this.accessModifClient = this.access[5].valueAccessView
      this.paielentFacture = this.access[6].action
      this.accessPaiementFac = this.access[6].valueAccessView
      this.paramPS = this.access[7].action
      this.accessParamPs = this.access[7].valueAccessView
      this.rechargeCarte = this.access[8].action
      this.accessRecharge = this.access[8].valueAccessView
      this.rechargeClient = this.access[9].action
      this.accessRechargeClient = this.access[9].valueAccessView
      //console.log("acceessView", this.accessView);
      //console.log("access", this.access);
    
   
   
    this.dtOptions = {
      ordering: true,
      pagingType: 'full_numbers',
      dom: 'flBrtip',
      destroy: true,
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
          extend: 'excel',
          title: 'liste des clients '
        }
      ]
    };

    this.RechargeClientForm = this.fb.group({
      "numCompte": "",
      "montant": 0,
      "typeCompte": "20",
      "typePayement": "espece",
      "dateEcheance": ""
    });
    this.formSearch = this.fb.group({
      clientId: [this.idClientDrop],
      status: [],
    });
    this.chargerClientList();
    this.chargerClientListDropdown();
  }

  getListClients() {
    let search = JSON.parse(JSON.stringify(this.formSearch.value));
    //console.log(search);
    this.chargerClientListById(search);
    // this.isLoading = true;
    // this.ClientList = [];
    // this.reinitialiser();

    // let search = JSON.parse(JSON.stringify(this.formSearch.value));
    // console.log(search);
    // this.clientService.List().subscribe(
    //   res => {
    //     this.ClientList = res;
    //     this.isLoading = false;
    //   },
    //   (err) => {
    //     this.isLoading = false;
    //   }
    // );
  }

  nextButtonClickEvent(): void {
    //console.log('next clicked');
  }

  selectClient(client) {
    this.idClient = client.idClient
    this.selectedClient = client
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
  

  
  
  
  

  

  getClientWithSolde(id) {
    
    
   
      this.clientService.GetClientWithSoldee(id).subscribe(
        (res: any) => {
          this.clienttobeBlocked = res

          this.statusPP = this.clienttobeBlocked.statusPP == "0" ? false : true
          this.statusPPE = this.clienttobeBlocked.statusPPE == "0" ? false : true
          this.statusPsP = this.clienttobeBlocked.statusPs == "0" ? false : true

          this.desactivateModal.show();
        })
    
  }

  BloquerDebloquer() {
    let item = {
      statusPP: this.statusPP ? "1" : 0,
      statusPPE: this.statusPPE ? "1" : 0,
      statusPsP: this.statusPsP ? "1" : 0,
      idClient: this.clienttobeBlocked.idClient,
      numCompte: this.clienttobeBlocked.numCompte
    }

    this.clientService.BloquerDebloquer(item).subscribe(
      res => {
        this.chargerClientList();
        this.desactivateModal.hide();
        this.toasterService.pop('success', '', ' Flux bloqué/debloqué  avec succès');
      }, (err) => {
        this.toasterService.pop('error', 'Une erreur est survenue',);
      }
    )
  }

  showDetailModal(event) {
    this.DetailModal.show()
  }
  chargerClientListDropdown() {
    this.clientService.GetClientsIdName().subscribe(
      res => {
        this.ClientListDropdown = res as [];
      }
    )
  }
  chargerClientListById(model) {
    this.reinitialiser();
    this.clientService.GetListClientById(model).subscribe(
      res => {
        this.ClientList = res;

        //console.log(this.ClientList)
        this.dtTrigger.next();
      }
    )
  }
  chargerClientList() {
    this.reinitialiser();
    this.clientService.List().subscribe(
      res => {
        this.ClientList = res;

        //console.log(this.ClientList)
        this.dtTrigger.next();
      }
    )
  }
  updateClient(id) {
    this.router.navigate(['/client/edit/' + id]);
  }

  activer() {

    this.clientService.Activer(this.selectedClient.idClient).subscribe(
      res => {
        var carte = this.ClientList.find(x => x.idClient == this.selectedClient.idClient)
        carte.status = '0'
        this.toasterService.pop('success', '', 'le client  a été activé avec succès');
        this.activateModal.hide();
        //   if(this.action=='bloquée')
        //   this.desactivateModal.hide()
        // else  if(this.action=='débloquée')
        //   this.activateModal.hide()

      }, (err) => {

        this.toasterService.pop('error', 'Une erreur est survenue',);

      }
    )
  }

  Bloquer() {

    this.clientService.BloquerClient(this.selectedClient.idClient).subscribe(
      res => {
        var carte = this.ClientList.find(x => x.idClient == this.selectedClient.idClient)
        carte.status = '1'

        this.toasterService.pop('success', '', 'le client a été Bloqué avec succès');
        this.BloquerModal.hide();

      },
      (err) => {
        this.toasterService.pop('error', '', 'une erreur est servenue');

      }
    )
  }
}
