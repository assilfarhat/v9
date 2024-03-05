import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TpeService } from 'app/services/tpe.service';
import { TokenService } from 'app/services/token.service';



@Component({
  selector: 'app-list-tpe',
  templateUrl: './list-tpe.component.html',
  styleUrls: ['./list-tpe.component.scss']
})
export class ListTpeComponent implements OnInit {

  user: any;

  tpes:any=[];
  ActualUser: string = "";
  accessView: any;
  access: any;
  ajoutTPE:any;
  accessajoutTPE:any;
  historiqueTPE: any;
  accessHistorique: any;
  modifTPE: any;
  accessModifTPE: any;
    
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {};
  dtTrigger = new Subject();
  role = this.tokenService.getRole()
  constructor(private tokenService: TokenService, private router: Router,
    private toasterService: ToasterService,
    private tpeService: TpeService) { }

 ngOnInit() {

  this.ActualUser = this.tokenService.getRole();
  this.accessView = this.tokenService.getAccess();
  
    this.access = JSON.parse(this.accessView).filter(item => item.idAccessView === 'TPE');
    this.ajoutTPE = this.access[0].action
    this.accessajoutTPE = this.access[0].valueAccessView
    this.historiqueTPE = this.access[1].action
   this.accessHistorique = this.access[1].valueAccessView
    this.modifTPE = this.access[2].action
    this.accessModifTPE = this.access[2].valueAccessView
    //console.log("acceessView", this.accessView);
    //console.log("access", this.access);
  
  this.user = this.tokenService.getUser();
  
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
        title: 'liste des TPEs'
      }
    ]
   };
   
   this.getList();


  } // end ngOnInit




  getList() {
    this.tpeService.getTpe().subscribe((resp: any) => {
      this.tpes = resp;
      
      this.dtTrigger.next();

    },
      (err) => {

      });
  }

  update(id) {
    let tpe = this.tpes.find(c => c.SerialNumber == id);
    this.router.navigate(['/tpe/edit', id, tpe.IdAffilie, tpe.IdPointDeVente])
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  };



}
