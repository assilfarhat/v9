import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToasterService } from 'angular2-toaster';
import { AmountPipe } from 'app/pipes/amount.pipe';
import { OperationsService } from 'app/services/operations.service';
import { TokenService } from 'app/services/token.service';
import { UserService } from 'app/services/user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-list-operation',
  templateUrl: './list-operation.component.html',
  styleUrls: ['./list-operation.component.scss']
})
export class ListOperationComponent implements OnInit {
  @ViewChild('activateModal') activateModal;
  @ViewChild('desactivateModal') desactivateModal;
  dtOptions: any = {};
  operations: any;
  allOperations: any
  submitted = true;
  selectedTPE;
  form: FormGroup;
  groupe: any;
  currentDate = new Date().toDateString();
  nameGroupe: string
  dtTrigger = new Subject();
  isLoading = true;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  selectedCarte;
  search: any;
  dateString: string;
  dateString2: string
  date: Date;
  role: string;
  banks: any;
  isAdmin: boolean = true;
  isDownloading = false;
  agences: any;
  affiliation: string
  params: any
  constructor(private operationService: OperationsService, private router: Router, private route: ActivatedRoute, private tokenService: TokenService, private datePipe: DatePipe, private amountPipe: AmountPipe, private fb: FormBuilder, private toasterService: ToasterService, private userServices: UserService, public dialog: MatDialog) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.params = params
    });
    this.affiliation = this.route.snapshot.paramMap.get('affiliation')
    this.role = this.tokenService.getRole()
    this.date = new Date();
    this.dateString = this.datePipe.transform(this.date, "yyyy-MM-dd")
    this.dateString2 = this.datePipe.transform(new Date(this.date.getFullYear(), this.date.getMonth(), 1), "yyyy-MM-dd")

    // console.log("=======================", this.dateString2);
    // console.log("=======================", this.dateString);

    this.form = this.fb.group({
      dateStart: [this.params['dateStart'] == undefined ? this.dateString2 : this.params['dateStart'], [Validators.required]],
      dateEnd: [this.params['dateEnd'] == undefined ? this.dateString : this.params['dateEnd'], [Validators.required]],

      typeOperation: [this.params['typeOperation'] == undefined ? "" : this.params['typeOperation']],

      nom: [this.params['nom'] == undefined ? "" : this.params['nom']],
      msisdn: [this.params['msisdn'] == undefined ? "" : this.params['msisdn']],
      // affiliation: [{value:'',disable:this.affiliation==undefined?false:true}]
      affiliation: [this.params['affiliation'] == undefined ? "" : this.params['affiliation']],

    })
    if (this.affiliation != null) {
      this.form.patchValue({ affiliation: this.affiliation })
      // this.form.controls.affiliation.disable();
    }

    this.dtOptions = {
      lengthMenu: [[10, 25, 50], [10, 25, 50]],
      serverSide: true,
      processing: true,
      ordering: false,
      searching: false,
      pagingType: 'full_numbers',
      ajax: (dataTablesParameters: any, callback) => {

        var page = dataTablesParameters.start / dataTablesParameters.length;
        this.search = dataTablesParameters.search.value,
          this.isLoading = true;
        this.operationService.GetOperations({
          "page1": page,
          "size1": dataTablesParameters.length,
          "search": dataTablesParameters.search.value,
          "dateDebut": this.form.value.dateStart.replace(/-/g, '') ? this.form.value.dateStart.replace(/-/g, '') + '000000000' : '10000101000000000',
          "dateFin": this.form.value.dateEnd.replace(/-/g, '') ? this.form.value.dateEnd.replace(/-/g, '') + '235959999' : '10000101235959999',
          "msisdn": this.form.value.msisdn,
          "typeOperation": this.form.value.typeOperation,
          "username": this.form.value.nom,
          "affiliation": this.form.value.affiliation
        })
          .subscribe((res: any) => {
            if (res.resultCode == 0) {
              
              this.operations = res.data;
              // console.log('dateee debuttt', res.data.dateDebut)
              // console.log('dateee debuttt', res.data.dateFin)
              this.isLoading = false;
              let recordsFiltred = res.info.count

              callback({
                recordsTotal: res.info.count,
                recordsFiltered: res.info.count,
                data: []
              },
                (err) => {
                  //console.log(err);
                  this.toasterService.pop('error', '', err.error.value);
                  this.isLoading = false
                }
              );
            } else {
              this.isLoading = false;
            }
          },
            (err) => {
              //console.log(err);
              this.toasterService.pop('error', '', "Unknown Error");
              this.isLoading = false
            });
      },
      language: {
        //  processing: "Processing...",
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
          last: "Pr&eacute;c&eacute;dent",
          next: "Suivant",
          previous: "Dernier"
        },
        aria: {
          sortAscending: ": Activer pour trier la colonne par ordre croissant",
          sortDescending: ": Activer pour trier la colonne par ordre d&eacute;croissant"
        }
      },

    };

  }


  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
    this.router.navigate(['ListOperations'], {
      queryParams: {
        dateStart: this.form.value.dateStart,
        dateEnd: this.form.value.dateEnd,
        typeOperation: this.form.value.typeOperation,
        nom: this.form.value.nom,
        msisdn: this.form.value.msisdn,
        affiliation: this.form.value.affiliation

      }
    })


  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dialog.closeAll();
    this.dtTrigger.unsubscribe();
  }
}
