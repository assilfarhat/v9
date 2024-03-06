
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ClientService } from 'app/services/client.service';
import { BonFilesService } from 'app/services/bon-files.service';
import { CarteService } from 'app/services/carte.service';

import { TokenService } from 'app/services/token.service';


@Component({
  selector: 'app-suivi-fichiers',
  templateUrl: './suivi-fichiers.component.html',
  styleUrls: ['./suivi-fichiers.component.scss']
})
export class SuiviFichiersComponent implements OnInit {
  form: FormGroup;
  @ViewChild('ConfirmRechargeModal') ConfirmRechargeModal;
  @ViewChild('EtatRechargeModal') EtatRechargeModal;
  @ViewChild('AnnulerRechargeModal') AnnulerRechargeModal;



  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  idClient = ''
  progress: number;
  recharge: any;
  dateString: string;
  isDownloading: boolean;
  renisialiser: boolean;
  selectedFile: any;
  ListRechargeClient: any
  ListeCarte: any;
  ClientList;
  bonRecharge: any;
  dtOptions: any = {};
  dtTrigger = new Subject();
  withParameter = false
  params: any;
  dateDebut: FormControl;
  dateFin: FormControl;
  currentDate = new Date().toDateString();
  date: Date;
  type: any;
  dateEchance: any;
  dateEchance2:any;
  accessView: any;
  access: any;
  telechargement: any;
  ActualUser: string = "";
  accessTelechargement: any;
  constructor(private _decimalPipe: DecimalPipe, private tokenService: TokenService, private datePipe: DatePipe, private route: ActivatedRoute, private clientService: ClientService, private bonFilesService: BonFilesService,
    private router: Router, private carteService: CarteService, private fb: FormBuilder, private toasterService: ToasterService) {
    //this.currentDate = this.datePipe.transform(this.currentDate, 'yyyyMMdd');
  }


  async reinitialiser() {

    this.renisialiser = true

    this.datatable()

    if (this.dtElement) {

      let dtInstance = await this.dtElement.dtInstance;

      if (dtInstance) {

        dtInstance.rows().remove().draw();;

        dtInstance.destroy();

      }

    }

  }

  datatable() {
    this.dtOptions = {
      ordering: true,
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
        }
      },
      buttons: [
        {
          extend: 'print',
          title: 'liste des fichiers '
        }
        ,
        {
          extend: 'excel',
          title: 'liste des fichiers '
        }


      ]
    };
  }


  ngOnInit() {

    this.ActualUser = this.tokenService.getRole();
    this.accessView = this.tokenService.getAccess();

      this.access = JSON.parse(this.accessView).filter(item => item.idAccessView === 'Liste des fichiers');
      this.telechargement = this.access[0].action
      this.accessTelechargement = this.access[0].valueAccessView
     
     
     
     
    
    this.route.queryParams.subscribe((params) => {
      this.params = params
    });

    this.datatable()
    //this.dateString = this.datePipe.transform(new Date(), "yyyyMMdd")


    // this.carteService.getBonRecharge(this.route.snapshot.paramMap.get('id')).subscribe(
    //   (res: any) => {
    //     this.bonRecharge = res;
    //     // console.log("bon recharge", res)
    //   }
    // );

    this.dateString = this.datePipe.transform(new Date(), "yyyy-MM-dd")

    if (this.route.snapshot.paramMap.get('id')) {
      this.idClient = this.route.snapshot.paramMap.get('id')
      this.withParameter = true;
    }


    this.form = this.fb.group({

      clientId: [{ value: this.withParameter ? this.idClient : (this.params['clientId'] == undefined ? '' : this.params['clientId']), disabled: this.withParameter }],
      dateFin: [this.params['dateFin'] == undefined ? this.dateString : this.params['dateFin']],
      dateDebut: [this.params['dateDebut'] == undefined ? this.dateString : this.params['dateDebut']],
      status: [this.params['status'] == undefined ? '' : this.params['status']],
      reference: [this.params['reference'] == undefined ? '' : this.params['reference']],
      typeFile: [this.params['typeFile'] == undefined ? '' : this.params['typeFile']],
      "numBon": [this.params['numBon'] == undefined ? '' : this.params['numBon']],
      "RaisonSociale": [this.params['RaisonSociale'] == undefined ? '' : this.params['RaisonSociale']],
      "Date": this.dateString,
    },
    )

    this.form.patchValue({
      dateDebut: this.dateString,
      dateFin: this.dateString,
    });

    // console.log('this.form.value', this.form.value)

    this.chargerClientList();
    this.getlistRecharge();




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

    // console.log('tesssst forlmlmmmmmm', filtre)
    // console.log("date deeeeeebut : " + this.form.value.dateDebut)

    filtre.dateDebut = this.datePipe.transform(this.form.get("dateDebut").value, 'yyyyMMdd')
    filtre.dateFin = this.datePipe.transform(this.form.get("dateFin").value, 'yyyyMMdd')

    // console.log('filtre.dateFinnnnnnnnnn', filtre.dateFin)
    //console.log('filtre.dateDebuuuuuuuuuuuut', filtre.dateDebut)
    //console.log('form recharg', this.form.value)

    let dateFin = this.datePipe.transform(this.form.get("dateFin").value, 'yyyyMMdd')
    let datedebut = this.datePipe.transform(this.form.get("dateDebut").value, 'yyyyMMdd')

    this.router.navigate(['/SuiviFichiers'], {
      queryParams: {
        clientId: this.form.value.clientId,
        "dateFin": dateFin,
        "dateDebut": datedebut,
        reference: this.form.value.reference,
        typeFile: this.form.value.typeFile,
        "numBon": this.form.value.numBon,
      }
    })


    this.bonFilesService.get(filtre).subscribe(
      (res: any) => {
        this.ListRechargeClient = res
        console.log('tesssst2333 ListRechargeClient', this.ListRechargeClient)
        this.reinitialiser()
        this.dtTrigger.next();
      })
  }



  get f() { return this.form.controls };

  printContact(cmpName: any) {

    var divToPrint = document.getElementById(cmpName);

    var newWin = window.open('', 'Print-Window');
    newWin.document.open();
    newWin.document.write('<html><style>table, th, td { border: 1px solid black;border-collapse: collapse; position:relative;border-collapse: collapse;table-layout: fixed; overflow: hidden; width: 100%}</style>')
    newWin.document.write('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
    newWin.document.close();
    // setTimeout(function () {
    //   newWin.close();
    // }, 1000);
    // newWin.onafterprint=function(){

    // }


  }

  download(path: string) {
    this.clientService.download(path).subscribe(
      (res: any) => {
        //console.log("Result code =" + res.resultCode)
        if (res.resultCode == 0) {


          //         var divToPrint = document.getElementById("iDdIV");
          //  var title= "Bon de paiement"



          //  var newWin = window.open('', 'Print-Window');
          //  newWin.document.open();
          //  newWin.document.write('<html><style>table, th, td { border: 1px solid black;border-collapse: collapse; position:relative;border-collapse: collapse;table-layout: fixed; overflow: hidden; width: 100%}</style>')
          //  newWin.document.write('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
          //  newWin.document.close();
          //  setTimeout(function() {
          //    newWin.close();
          //  }, 1000);



        } else {
          //console.log(res)

          this.isDownloading = false;

        }
      },
      (err) => {
        // console.log(err)
        this.isDownloading = false;
      })
  }




  DownloadBon(file, type) {
    this.selectedFile = file
    this.type = type
     //console.log("fileeee", this.selectedFile)
    var obj = {
      reference: file.reference,
      bonType: type,
      codeclient : file.codeClient,
      dateBon : file.dateBon,
      Amount : file.amount,

    }
   
    this.bonFilesService.getFileEtat(obj).subscribe(
      (res: any) => {
      this.ListeCarte = res
      //console.log("this.ListeCarte", this.ListeCarte)
       this.ListeCarte.map(x=>this.changeDate(x))
        setTimeout(() => {
          if (type == "etat de Rechargement")
            this.printContact("iDdIV2")
          else
            this.printContact("iDdIV")
        }, 1000);
      })
  }
  changeDate(x:any){
    if (x.dateEcheance != null) x.dateEcheance = x.dateEcheance.substring(0, 8);
    if (x.dateEcheance2 != null) x.dateEcheance2 = x.dateEcheance2.substring(0, 8);
  }






}
