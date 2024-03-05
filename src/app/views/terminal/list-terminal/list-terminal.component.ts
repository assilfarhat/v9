import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { ClientService } from 'app/services/client.service';
import { TerminalService } from 'app/services/terminal.service';
import { Subject } from 'rxjs';
import { TokenService } from 'app/services/token.service';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-list-terminal',
  templateUrl: './list-terminal.component.html',
  styleUrls: ['./list-terminal.component.scss']
})
export class ListTerminalComponent implements OnInit {
  @ViewChild('DesactiverModal') DesactiverModal;
  @ViewChild('ActiverModal') ActiverModal;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  terminals: any = [];

  user: any;
  dtOptions: any = {};
  dtTrigger = new Subject();

  
  ActualUser: string = "";
  accessView: any;
  access: any;
  ajoutTeminal:any;
  accessajoutTeminal:any;
  historiqueTerminal: any;
  accessHistorique: any;
  modifTerminal: any;
  accessModifTerminal: any;
  Bloquer:any;
  accessBloquer:any;

  submitted = true;
  selectedUser;
  form: FormGroup;
  oldterminalStation : any;
  filterQuery = '';
  role : any;
  constructor(private router: Router,
    private toasterService: ToasterService,
    private terminalService: TerminalService,
    private tokenService: TokenService) { }

  ngOnInit() {
    this.ActualUser = this.tokenService.getRole();
  this.accessView = this.tokenService.getAccess();
  
    this.access = JSON.parse(this.accessView).filter(item => item.idAccessView === 'Terminal');
    this.ajoutTeminal = this.access[0].action
    this.accessajoutTeminal = this.access[0].valueAccessView
    this.Bloquer = this.access[1].action
   this.accessBloquer = this.access[1].valueAccessView
   this.historiqueTerminal = this.access[2].action
   this.accessHistorique = this.access[2].valueAccessView
    this.modifTerminal = this.access[3].action
    this.accessModifTerminal = this.access[3].valueAccessView
    //console.log("acceessView", this.accessView);
    ////console.log("access", this.access);
  
    this.user = this.tokenService.getUser();
    this.role= this.tokenService.getRole()
    this.dtOptions = {
      ordering: true,
      pagingType: 'full_numbers',
      dom: 'flBrtip',
      destroy: true,
      lengthMenu: [[10, 25, 50], [10, 25, 50]],
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
          title: 'liste des terminaux'
        }
      ]
    };

    this.getTerminals()


  }// end ngOnInit



  selectUser(id: any) {
    // console.log("id t", id)
    this.selectedUser = this.terminals.find(u => u.idTerminal == id);
    // console.log(this.selectedUser)
  }

  getTerminals() {
    this.terminalService.getAll().subscribe(
      (resp: any) => {
        //console.log("list trrr", resp)
        this.terminals = resp;
        this.oldterminalStation = resp.oldTerminal
       // console.log("this.oldterminalStation" , this.oldterminalStation)
        this.dtTrigger.next();
        
      }
    )
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }




  activer(Action) {
    // console.log(Action)
    this.terminalService.Activate(this.selectedUser.idTerminal).subscribe(
      (resp: any) => {
        // console.log(resp)
        //console.log(resp)
        if (Action == "Activer") {
          this.selectedUser.etatTerminal = 1;
          this.ActiverModal.hide();
          this.toasterService.pop('success', '', 'Le terminal a été activé');

        }
        if (Action == "Desactiver") {
          this.selectedUser.etatTerminal = 0;
          this.DesactiverModal.hide();
          this.toasterService.pop('success', '', 'Le terminal a été désactivé');

        }

      },
      (err: any) => {
        this.ActiverModal.hide();
        this.DesactiverModal.hide();
        // console.log(err)
        this.toasterService.pop('error', '', 'Une erreur est survenu');
      }
    )



  }
}
