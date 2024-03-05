import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToasterService } from 'angular2-toaster';
import { AmountPipe } from 'app/pipes/amount.pipe';
import { CarteService } from 'app/services/carte.service';
import { ClientService } from 'app/services/client.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-historique-recharge-transfert-carte',
  templateUrl: './historique-recharge-transfert-carte.component.html',
  styleUrls: ['./historique-recharge-transfert-carte.component.scss']
})

export class HistoriqueRechargeTransfertCarteComponent implements OnInit {
  dtOptions: any = {};
  operations: any;
  ClientList = []
  form: FormGroup;
  currentDate = new Date().toDateString();
  dtTrigger = new Subject();
  isLoading = true;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  search: any;
  dateString: string;
  dateString2: string
  date: Date;
  params: any;
  renisialiser: boolean;
  page: number;
  constructor(private carteSerivce: CarteService, private clientService: ClientService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe, private amountPipe: AmountPipe, private fb: FormBuilder, private toasterService: ToasterService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.params = params
    });

    this.date = new Date();
    this.dateString = this.datePipe.transform(this.date, "yyyy-MM-dd")
    this.dateString2 = this.datePipe.transform(new Date(this.date.getFullYear(), this.date.getMonth(), 1), "yyyy-MM-dd")
    this.form = this.fb.group({
      clientId: [this.params['clientId'] == undefined ? '' : this.params['clientId']],
      dateFin: [this.params['dateFin'] == undefined ? this.dateString : this.params['dateFin']],
      dateDebut: [this.params['dateDebut'] == undefined ? this.dateString : this.params['dateDebut']],
      status: [this.params['status'] == undefined ? '' : this.params['status']],
      typeSolde: [this.params['typeSolde'] == undefined ? '' : this.params['typeSolde']],
      typeTransaction: [this.params['typeTransaction'] == undefined ? '' : this.params['typeTransaction']],
      "montantMin": [this.params['montantMin'] == undefined ? '' : this.params['montantMin']],
      "montantMax": [this.params['montantMax'] == undefined ? '' : this.params['montantMax']],
      "Porteur": [this.params['Porteur'] == undefined ? '' : this.params['Porteur']],
      "Date": this.dateString,
      "Montant": "",
    })
    this.chargerClientList()
    this.datatable();
  }

  chargerClientList() {
    this.clientService.GetClientsIdName().subscribe(
      res => {
        this.ClientList = res as []
      }
    )
  }

  datatable() {
    this.dtOptions = {
      ordering: true,
      pagingType: 'full_numbers',
      destroy: true,
      lengthMenu: [[10, 25, 50], [10, 25, 50]],
      serverSide: true,
      processing: true,
      searching: false,

      displayStart: this.renisialiser ? 0 : (this.params['page'] ? this.params['page'] * 10 : 0),

      ajax: (dataTablesParameters: any, callback) => {

        if (this.renisialiser || Number.isNaN(this.params['page'])) {
          this.page = 0
          this.renisialiser = false
        }
        else if ((this.params['page'] != undefined && dataTablesParameters.start == 0))
          this.page = this.params['page']
        else
          this.page = dataTablesParameters.start / dataTablesParameters.length;

        this.router.navigate(['SuiviRechargeTransfert'], {
          queryParams: {
            "page": this.page,
            clientId: this.form.value.clientId,
            dateFin: this.datePipe.transform(this.form.value.dateFin, "yyyy-MM-dd"),
            dateDebut: this.datePipe.transform(this.form.value.dateDebut, "yyyy-MM-dd"),
            status: this.form.value.status,
            typeSolde: this.form.value.typeSolde,
            typeTransaction: this.form.value.typeTransaction,
            "montantMin": this.form.value.montantMin,
            "montantMax": this.form.value.montantMax,
            "Montant": this.form.value.Montant,
            "Porteur": this.form.value.Porteur,
          }
        })

        this.search = dataTablesParameters.search.value,
          this.isLoading = true;
        this.carteSerivce.GetOperationsTransfertRecharge({
          "startNumber": this.page,
          "maxResults": dataTablesParameters.length,
          clientId: this.form.value.clientId,
          dateFin: this.form.value.dateFin ? this.datePipe.transform(this.form.value.dateFin, "yyyyMMdd") + '235959999' : '99990101235959999',
          dateDebut: this.form.value.dateDebut ? this.datePipe.transform(this.form.value.dateDebut, "yyyyMMdd") + '000000000' : '10000101000000000',
          typeSolde: this.form.value.typeSolde,
          typeTransaction: this.form.value.typeTransaction,
          "montantMin": this.form.value.montantMin,
          "montantMax": this.form.value.montantMax,
          "Porteur": this.form.value.Porteur,
          codeClient: this.form.value.codeClient
        }
        ).subscribe((res: any) => {
            this.operations = res.listOp;
            this.isLoading = false;
            let recordsFiltred = res.count

            callback({
              recordsTotal: recordsFiltred,
              recordsFiltered: recordsFiltred,
              data: []
            },
              (err) => {
                //console.log(err);
                this.toasterService.pop('error', '', err.error.value);
                this.isLoading = false
              }
            );
            // } else {
            //   console.log(res)

            //   this.isLoading = false

            // }
          },
            (err) => {
             // console.log(err);
              this.toasterService.pop('error', '', "Unknown Error");
              this.isLoading = false
            });
      },
      language: {
        processing: "Processing...",
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
      }
    };
  }

  rerender(): void {
    this.renisialiser = true
    this.datatable()
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
