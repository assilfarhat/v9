import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe } from '@angular/common';
import { ReclamationService } from 'app/services/reclamation.service';
import { Subject } from 'rxjs';
import { ToasterService } from 'angular2-toaster';
import { TokenService } from 'app/services/token.service';
import { ClientService } from 'app/services/client.service';
import { StationsService } from 'app/services/stations.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.scss']
})
export class ReclamationComponent implements OnInit {
  @ViewChild('updateModal') updateModal;
  @ViewChild(DataTableDirective)


  dtElement: DataTableDirective;
  form: FormGroup;
  formUpdate: FormGroup;
  formUpdateIMAGE: FormGroup;

  submitted: boolean;
  dtOptions: any = {};
  dtTrigger = new Subject();
  reclamations: any[] = [];

  Nomclient: string;
  Prenomclient: string;
  Statut: string;
  Role: string;
  getRec = false;
  listOfReclamation: any[] = [];
  ReclamationInfo: any;
  filterform: any;
  listReclm: any[] = [];
  ReclmInfo: any = [];
  ClientList = [];
  StationList = [];
  getRecl = false;
  selectedRec;
  params: any
  page: number;
  renisialiser: any = false;
  ActualUser: string = "";
accessView: any;
access: any;
ajoutReclamation:any;
accessajoutRecalamation:any;
idStation :any;

modifReclamation: any;
accessModifReclamation: any;
  roleUser = this.tokenService.getRole()
  constructor(private tokenService: TokenService, private fb: FormBuilder, private ReclamationService: ReclamationService,
    private datePipe: DatePipe,
    private stationsService: StationsService,
    private toasterService: ToasterService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute) {
    
  }
  currentDate = new Date().toDateString();

  ngOnInit() {

    this.ActualUser = this.tokenService.getRole();
    //console.log("role",this.ActualUser);
    
    const isGerant = this.ActualUser === 'GERANT';
    //console.log("role1",this.ActualUser);
    

    this.idStation = this.tokenService.getUser().idStation
    //console.log("this.idStation",this.idStation);

    this.accessView = this.tokenService.getAccess();
    
      this.access = JSON.parse(this.accessView).filter(item => item.idAccessView === 'Suivi des réclamations');
      this.ajoutReclamation = this.access[0].action
      this.accessajoutRecalamation = this.access[0].valueAccessView
      this.modifReclamation = this.access[1].action
      this.accessModifReclamation = this.access[1].valueAccessView
      //console.log("acceessView", this.accessView);
      //console.log("access", this.access);
    

    this.route.queryParams.subscribe((params) => {
      this.params = params
    });

    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    
    this.form = this.fb.group({
      dateStart: [this.params['dateStart'] == undefined ? this.currentDate : this.params['dateStart'], [Validators.required]],
      dateEnd: [this.params['dateEnd'] == undefined ? this.currentDate : this.params['dateEnd'], [Validators.required]],
      IdClient: [this.params['IdClient'] == undefined ? '' : this.params['IdClient']],
      IdStation: [this.params['IdStation'] == undefined ? '' : this.params['IdStation']],
      statut: [this.params['statut'] == undefined ? '' : this.params['statut']],
      role: [''],
      image : [{ value: ''}],  

    }
      ,
      {
        validator: [this.CompareDate('dateStart', 'dateEnd')]

      });

      

    this.dtOptions = {

      lengthMenu: [[10, 25, 50], [10, 25, 50]],
      serverSide: true,
      //processing: true,
      ordering: false,
      searching: false,

      ajax: (dataTablesParameters: any, callback) => {

        if (this.renisialiser || Number.isNaN(this.params['page'])) {
          this.page = 0
          this.renisialiser = false
        }
        else if ((this.params['page'] != undefined && dataTablesParameters.start == 0))
          this.page = this.params['page']
        else
          this.page = dataTablesParameters.start / dataTablesParameters.length;



        this.form.value.dateStart = this.datePipe.transform(this.form.value.dateStart, "yyyy-MM-dd")
        this.form.value.dateEnd = this.datePipe.transform(this.form.value.dateEnd, "yyyy-MM-dd")
        this.ReclamationService.getAllReclamations({
          "page": this.page,
          "size": dataTablesParameters.length,
          "dateStart": this.form.value.dateStart.replace(/-/g, '') ? this.form.value.dateStart.replace(/-/g, '') + '000000000' : '10000101000000000',
          "dateEnd": this.form.value.dateEnd.replace(/-/g, '') ? this.form.value.dateEnd.replace(/-/g, '') + '235959999' : '99990101235959999',
          "IdStation": isGerant ? this.idStation : this.form.get('IdStation').value,
          "IdClient": this.form.get('IdClient').value,
          "statut": this.form.get('statut').value

        })
          .subscribe(resp => {
            this.getRecl = true;
            this.listReclm = resp.data;
            ////console.log(" this.listReclm", this.listReclm);
            
            this.ReclmInfo = resp.infos;
            //console.log(" this.infos", this.ReclmInfo);
            
            let recordsFiltred = resp.infos.count
            callback({
              recordsTotal: 100,
              recordsFiltered: recordsFiltred,
              data: []
            },
              (err) => console.log("err", err));

          })



      },
      language: {
        processing: "<div style='position: absolute; z-index: 9999;margin-right: 43%;margin-left: 43%;margin-top:-20px;'></div>",
        search: "Rechercher&nbsp;:",
        lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
        info: "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty: "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        infoFiltered: "",
        infoPostFix: "",
        loadingRecords: "Chargement en cours...",
        zeroRecords: "",
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
      dom: 'lBrtip',
      buttons: [

      ]

    };



    this.chargerClientList();
    this.chargerStationsList();


  }

  chargerClientList() {
    this.clientService.GetClientsIdName().subscribe(
      res => {
        this.ClientList = res as []
      }
    )
  }


  //====================
  chargerStationsList() {
    this.stationsService.GetStationsIdName().subscribe(
      res => {
        this.StationList = res as [];
      }
    )
  }




  selectReclamation(id: any) {
    this.selectedRec = this.listReclm.find(u => u.id == id);
    //console.log("this.selectedRec",this.selectedRec)
    //console.log("this.selectedRecimaaage",this.selectedRec.image)

    this.formUpdate = this.fb.group({
      PrenomClient: [this.selectedRec.userName],
      object: [this.selectedRec.objectReclamation],
      Message: [this.selectedRec.messageReclamation],
      Statut: [this.selectedRec.statut, [Validators.required]],
      image : [this.selectedRec.image], 

    })

    this.formUpdateIMAGE = this.fb.group({
      image : [this.selectedRec.image], 
    })

    //("this.formUpdate" ,this.formUpdate.value)
    ///console.log("this.formUpdateIMAGE" ,this.formUpdateIMAGE.value)
    
  }


  update() {
    this.submitted = true;
    // console.log(this.selectedRec);
    if (this.formUpdate.valid) {
      let form = this.formUpdate.value;
      this.ReclamationService.update(this.selectedRec.id, form).subscribe(
        (res: any) => {

          this.updateModal.hide();
          this.listReclm.find(c => c.id == this.selectedRec.id).statut = form.Statut;


          this.toasterService.pop('info', '', 'La réclamation a été modifiée avec succès');
          this.updateModal.hide();


        },
        (err) => {


          this.toasterService.pop('error', '', 'Un erreur est survenue')

        }
      );
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

  rerender(): void {
    this.submitted = true;
    if (!this.form.valid)
      return;

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });


    this.router.navigate(['reclamations'], {
      queryParams: {
        page: this.page,
        dateStart: this.datePipe.transform(this.form.value.dateStart, "yyyy-MM-dd"),
        dateEnd: this.datePipe.transform(this.form.value.dateEnd, "yyyy-MM-dd"),
        merchant: this.form.value.merchant,
        IdStation: this.form.value.IdStation,
        IdClient: this.form.value.IdClient,
        statut: this.form.value.statut


      }
    })
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  get dateStart() { return this.form.get('dateStart') };
  get dateEnd() { return this.form.get('dateEnd') };
  get IdClient() { return this.form.get('IdClient') };
  get IdStation() { return this.form.get('IdStation') };
  get statut() { return this.form.get('statut') };
  get role() { return this.form.get('role') };


}
