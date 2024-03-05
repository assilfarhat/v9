import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ProduitsService } from 'app/services/produits.service';
import { StationsService } from 'app/services/stations.service';
import { TokenService } from 'app/services/token.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})
export class StationListComponent implements OnInit {

  stations = []
  dtElement: DataTableDirective;
  isLoading: boolean = false;
  form: FormGroup;
  submitted: boolean;
  dtOptions: any = {};
  dtTrigger = new Subject();
  reclamations: any[] = [];
  datedebut;
  datefin;
  ListFamillles: any = [];
  produits: any = [];
  ActualUser: string = "";
  accessView: any;
  access: any;




  historiqueStation: any;
  accessHistorique: any;
  modifStation: any;
  accessModifStation: any;
  constructor(private tokenService: TokenService, private fb: FormBuilder, private stationsService: StationsService,
    private datePipe: DatePipe) {
    this.currentDate = this.datePipe.transform(this.currentDate, 'dd-MM-yyyy');
  }
  currentDate = new Date().toDateString();

  ngOnInit() {
    this.ActualUser = this.tokenService.getRole();

    this.accessView = this.tokenService.getAccess();
   
      this.access = JSON.parse(this.accessView).filter(item => item.idAccessView === 'Station');
      // this.historiqueStation = this.access[0].action
      // this.accessHistorique = this.access[0].valueAccessView
      this.modifStation = this.access[0].action
      this.accessModifStation = this.access[0].valueAccessView


     // console.log("acceessView", this.accessView);
     // console.log("access", this.access);
    
    this.getListStation();
    this.form = this.fb.group({
      dateDebut: ['',],
      dateFin: ['',],
      type: [''],
      famille: [''],
      produit: ['']


    }
      ,
      {
        validator: [this.CompareDate('dateDebut', 'dateFin')]

      })




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
          title: 'liste des stations '
        }
        ,
        {
          extend: 'excel',
          title: 'liste des stations '
        }

      ]
    };

  }

  getListStation() {

    this.isLoading = true
    this.stationsService.getAllStation()
      .subscribe((resp: any) => {
        this.reinitialiser()
        this.stations = resp as []
        // console.log(this.stations)
        this.dtTrigger.next();
        this.isLoading = false;
      },
        (err) => {
          this.isLoading = false;

        }
      );
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

  CompareDate(startDate: string, endDate: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[startDate];
      const matchingControl = formGroup.controls[endDate];

      if (matchingControl.errors && !matchingControl.errors.compareDate) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      if (control.errors && !control.errors.compareDate) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      // set error on matchingControl if validation fails
      if (control.value > matchingControl.value) {
        matchingControl.setErrors({ compareDate: true });
      } else {
        matchingControl.setErrors(null);
      }
      if (control.value > this.currentDate) {
        control.setErrors({ compareDate: true });
      } else {
        control.setErrors(null);
      }
      if (matchingControl.errors && !matchingControl.errors.currentDate) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      if (matchingControl.value > this.currentDate) {
        matchingControl.setErrors({ currentDate: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }



  get f() { return this.form.controls };

}
