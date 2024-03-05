import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { AffilService } from 'app/services/affil.service';
import { AffilieService } from 'app/services/affilie.service';
import { TokenService } from 'app/services/token.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-list-affil',
  templateUrl: './list-affil.component.html',
  styleUrls: ['./list-affil.component.scss']
})
export class ListAffilComponent implements OnInit {

  user: any;
  affils: any = [];
  IdAffilie: any;
  selectedUser;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  @ViewChild('DesactiverModal') DesactiverModal;
  @ViewChild('ActiverModal') ActiverModal;

  constructor(private router: Router,
    private toasterService: ToasterService,
    private affilService: AffilieService, private tokenService: TokenService) { }

  ngOnInit() {
    this.user = this.tokenService.getUser();

    this.dtOptions = {
      scrollX: true,
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
        },

      },


    };
    this.getAffils();

  } // end ngOnInit





  getAffils() {
    this.affilService.ListAll().subscribe((resp: any) => {
      this.affils = resp;
      //console.log(resp)
      this.dtTrigger.next();

    },
      (err) => {

      });
  }

  update(id) {
    this.router.navigate(['/affilation/edit', id])
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  selectUser(id: any) {
    this.IdAffilie = id;

    this.selectedUser = this.affils.find(u => u.IdAffilie == id);
    //console.log(this.selectedUser)
  }



  activer() {

    this.affilService.Activate(this.IdAffilie).subscribe(

      (resp: any) => {
        //console.log(resp)
        if (resp == "Desactive") {

          this.selectedUser.Actif = 1;
          //console.log(this.selectedUser)
          this.DesactiverModal.hide()
          this.ActiverModal.hide();

          this.toasterService.pop('success', '', 'L\'affilie a été  désactivé');

        }

        if (resp == "Active") {
          this.selectedUser.Actif = 0;
          //console.log(this.selectedUser)
          this.DesactiverModal.hide()
          this.ActiverModal.hide();
          this.toasterService.pop('success', '', 'L\'affilie a été  activé');




        }

      },
      (err) => {
        this.DesactiverModal.hide();
        this.ActiverModal.hide();
        this.toasterService.pop('error', '', 'Une erreur est survenue');
      }

    )
  }



}
