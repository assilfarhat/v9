
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { HttpResponse } from '@aspnet/signalr';
import { HttpEventType } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClientService } from 'app/services/client.service';


@Component({
  selector: 'app-suivi-facture',
  templateUrl: './suivi-facture.component.html',
  styleUrls: ['./suivi-facture.component.scss']
})
export class SuiviFactureComponent implements OnInit {

  form: FormGroup;
  @ViewChild('ConfirmRechargeModal') ConfirmRechargeModal;
  @ViewChild('EtatRechargeModal') EtatRechargeModal;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  idClient = ''
  progress: number;
  recharge: any;
  dateString: string;
  isDownloading: boolean;
  ListNotes = [{ date: "20/02/2022 -> 21/02/2022", refernce: "00191800" }]
  show = false;
  constructor(private datePipe: DatePipe, private route: ActivatedRoute, private clientService: ClientService, private router: Router, private fb: FormBuilder, private toasterService: ToasterService) { }
  ListRechargeClient: any
  ClientList;
  dtOptions: any = {};
  dtTrigger = new Subject();
  withParameter = false
  async reinitialiser() {
    if (this.dtElement) {
      let dtInstance = await this.dtElement.dtInstance;
      if (dtInstance) {
        dtInstance.rows().remove().draw();;
        dtInstance.destroy();
      }
    }
  }
  ngOnInit() {
    this.dtOptions = {
      ordering: false,
      pagingType: 'full_numbers',
      dom: 'flBrtip',
      searching: false,
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
        }, buttons: []
      },

    };
    this.dateString = this.datePipe.transform(new Date(), "yyyy-MM-dd")

    if (this.route.snapshot.paramMap.get('id')) {
      this.idClient = this.route.snapshot.paramMap.get('id')
      this.withParameter = true;
    }

    this.form = this.fb.group({
      clientId: [{ value: this.idClient, disabled: this.withParameter }],
      dateFin: [this.dateString,],
      dateDebut: [this.dateString,],
      status: ['',],
      typeCompte: ['',],
      typePayement: ['',],

      "montantMin": "",
      "montantMax": "",
      "numBon": "",
      "RaisonSociale": "",
      "Date": this.dateString,
      "Montant": "",
      "reference": ""
    }
    )


    this.chargerClientList();
    this.getlistRecharge()
  }

  // download(file) {
  //   this.clientService.download(file).subscribe((event :Blob) => {
  //       // if (event.type === HttpEventType.UploadProgress.toString())
  //       //     this.progress = Math.round((100 * event.) / event.size);
  //       // else 
  // //       console.log(HttpEventType)
  // //  console.log(HttpEventType)
  // //       if (event.type === HttpEventType.Response.toString()) {
  // //         this.toasterService.pop('success', '', 'fichier ');
  // //         console.log(event)
  //         this.downloadFile(event, file);
  //      // }
  //   });
  // }
  // private downloadFile(data, file) {
  //   const downloadedFile = new Blob([data.body], { type: data.body.type });
  //   const a = document.createElement('a');
  //   a.setAttribute('style', 'display:none;');
  //   document.body.appendChild(a);
  //   a.download = 'C:\StaticFiles\FilesStarOil\'+file
  //   a.href = URL.createObjectURL(downloadedFile);
  //   a.target = '_blank';
  //   a.click();
  //   document.body.removeChild(a);
  // }
  chargerClientList() {
    this.clientService.GetClientsIdName().subscribe(
      res => {
        this.ClientList = res as []
      }
    )
  }


  selectRecharge(item) {
    this.recharge = item
  }


  getlistRecharge() {


    let filtre = JSON.parse(JSON.stringify(this.form.getRawValue()))
    // console.log(this.form.value)
    this.form.value.dateDebut = this.datePipe.transform(this.form.value.dateDebut, "yyyy-MM-dd")
    this.form.value.dateFin = this.datePipe.transform(this.form.value.dateFin, "yyyy-MM-dd")

    filtre.dateDebut = this.form.value.dateDebut.replace(/-/g, '') ? this.form.value.dateDebut.replace(/-/g, '') + '000000000' : '10000101000000000',
    filtre.dateFin = this.form.value.dateFin.replace(/-/g, '') ? this.form.value.dateFin.replace(/-/g, '') + '235959999' : '99990101235959999',

      this.clientService.GetRechargeClient(filtre).subscribe(
        (res: any) => {
          this.ListRechargeClient = res
          this.reinitialiser()
          this.dtTrigger.next();
        })
  }


  EtatRecharge() {

    // console.log("id recharge est " + this.recharge.id)
    var id = this.recharge.id
    this.clientService.GetRechargeData(id).subscribe(

      (res: any) => {
        this.toasterService.pop("success", "PDf Etat de rechargement téléchargé avec succèss")

        this.EtatRechargeModal.hide()
        // console.log(res)
        //  setTimeout(()=>{    
        //   this.form.patchValue(
        //     {

        //       numBon :res.result.bonPayment,
        //       RaisonSociale : this.ListRechargeClient.find(x=>x.id==this.recharge.id).raisonSociale,
        //       Montant: this.ListRechargeClient.find(x=>x.id==this.recharge.id).montant,
        //       reference :res.result.reference
        //     }
        //   )},1000)
        setTimeout(() => {
          this.printContact("iDdIV2")



        }, 1000);

      },
      (err: any) => {

        this.toasterService.pop("error", err.error);
      }


    )
  }



  confirmerRecharge() {
    var confirmation = { id: this.recharge.id, action: 'confirmer' }
    this.clientService.ConfirmerRecharge(confirmation).subscribe(

      (res: any) => {
        this.toasterService.pop("success", "confirmation effectué avec succèss")
        this.ListRechargeClient.find(x => x.id == this.recharge.id).statusValidation = 'confirmer'
        this.ConfirmRechargeModal.hide()
        //console.log(res)
        setTimeout(() => {
          this.form.patchValue(
            {

              numBon: res.result.bonPayment,
              RaisonSociale: this.ListRechargeClient.find(x => x.id == this.recharge.id).raisonSociale,
              Montant: this.ListRechargeClient.find(x => x.id == this.recharge.id).montant,
              reference: res.result.reference
            }
          )
        }, 1000)
        setTimeout(() => {
          this.printContact("iDdIV")



        }, 1000);

      },
      (err: any) => {

        this.toasterService.pop("error", err.error);
      }


    )
  }
  get f() { return this.form.controls };
  printContact(cmpName: any) {

    var divToPrint = document.getElementById(cmpName);

    var newWin = window.open('', 'Print-Window');
    newWin.document.open();
    newWin.document.write('<html><style>table, th, td { border: 1px solid black;border-collapse: collapse; position:relative;border-collapse: collapse;table-layout: fixed; overflow: hidden; width: 100%}</style>')
    newWin.document.write('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
    newWin.document.close();
    setTimeout(function () {
      newWin.close();
    }, 1000);
    // newWin.onafterprint=function(){  

    // }


  }


  download(path: string) {
    this.clientService.download(path).subscribe(
      (res: any) => {
        /////console.log("Result code =" + res.resultCode)
        if (res.resultCode == 0) {





        } else {
         // console.log(res)

          this.isDownloading = false;

        }
      },
      (err) => {
       // console.log(err)
        this.isDownloading = false;
      })
  }

}
