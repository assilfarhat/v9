import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NoteDebitCreditService } from 'app/services/note-debit-credit.service';
import { TokenService } from 'app/services/token.service';
import { DataTableDirective } from 'angular-datatables';
import { StationsService } from 'app/services/stations.service';
import { CompareDates } from 'app/shared/Validators';
import { SuiviTransactionsService } from 'app/services/suivi-transactions.service';
import { log } from 'console';


@Component({
  selector: 'app-note-debit-credit',
  templateUrl: './note-debit-credit.component.html',
  styleUrls: ['./note-debit-credit.component.scss']
})
export class NoteDebitCreditComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  dateString: string;
  dateStringNDC2: string;

  //isDownloading: boolean;
  form: FormGroup;
  ListNotes = [];
  isAdmin = false;
  show = false;
  showNd = false;
  showNc = false;
  renisialiser: boolean;
  page: number = 0;
  quantiteFormatee:any;
  quantiteArrondie:any;
  params: any
  idStation = this.tokenService.getUser().idStation;
  dtOptions: any = {};
  dtOptions2: any = {};
  StationList: any = [];
  dtTrigger = new Subject();
  dtTrigger2 = new Subject();
  detailNote: any;
  ListdetailNote: any = [];
  ListdetailNoteNc: any = [];
  ListdetailNoteNd: any = [];
  selectedNote: any;
  selectedNoteC: any;
  selectedNoteD: any;
  station : any = {}
  listTransaction: any;
  jointure: any;
  TotalTVA: number = 0;
  TotalHTVA: number = 0;
  TotalTTC: number = 0;
  TotalTVAND: number = 0;
  TotalHTVAND: number = 0;
  TotalTTCND: number = 0;
  Total: number;
  TotalMtva: number = 0;
  TotalMhtva: number = 0;
  TotalMntNc: number = 0;
  MntTtlNDC: string = "";
  MntTtlND: string = "";
  MntTtlNDnull: string = "";
  MntTtlNC: string = "";
  ActualUser: string = "";
  idStation1: any;
  ListdetailNoteNdcommission: any
  accessView: any;
  access: any;
  telechargement: any;
  accessTelechargement: any;
  // async reinitialiser(){

  //   let dtInstance = await this.dtElement.dtInstance;

  //   console.
  //   if(dtInstance){
  //   dtInstance.rows().remove().draw();;
  //   dtInstance.destroy();}
  // }
  name: string;

  constructor( private _decimalPipe: DecimalPipe, private tokensService: TokenService, private stationsService: StationsService, private tokenService: TokenService, private fb: FormBuilder, private router: Router, private datePipe: DatePipe, private route: ActivatedRoute, private noteDebitCreditService: NoteDebitCreditService, private toasterService: ToasterService) { }


  ngOnInit() {
    this.ActualUser = this.tokenService.getRole();
    this.accessView = this.tokenService.getAccess();
    
      this.access = JSON.parse(this.accessView).filter(item => item.idAccessView === 'débit Crédit');
      this.telechargement = this.access[0].action
      this.accessTelechargement = this.access[0].valueAccessView
      //  this.confirmPS = this.access[1].action
      //  this.accessconfirmPS =this.access[1].valueAccessView
      //console.log("acceessView", this.accessView);
      //console.log("access", this.access);
    
    if (this.tokensService.getRole() == "ADMIN STAROIL") {
      this.isAdmin = true;
    }
    const dateStringNDC = new Date();
    dateStringNDC.setDate(dateStringNDC.getDate() - 1);
    this.dateString = this.datePipe.transform(new Date(), "yyyy-MM-dd")
    this.dateStringNDC2 = this.datePipe.transform(dateStringNDC, "yyyy-MM-dd")
    //console.log("datfv",this.dateStringNDC2);
    


    this.route.queryParams.subscribe((params) => {
      this.params = params
    });

    //console.log("idStation ",this.tokenService.getUser().idStation)
    this.form = this.fb.group({
      "type": "NDC",
      "Statut": [this.idStation ? "0" : (this.params['Statut'] == undefined ? '' : this.params['Statut'])],
      "dateFin": [this.params['dateFin'] == undefined ? this.dateStringNDC2 : this.params['dateFin']],
      "dateDebut": [this.params['dateDebut'] == undefined ? this.dateStringNDC2 : this.params['dateDebut']],
      "IdStation": [this.idStation ? this.idStation : (this.params['IdStation'] == undefined ? '' : this.params['IdStation'])],
      "reference": [this.params['reference'] == undefined ? '' : this.params['reference']],
      "code": [this.params['code'] == undefined ? '' : this.params['code']],

    }
      , {
        validator: [

          CompareDates(
            'dateDebut'
            , 'dateFin'
          )
        ]


      }
    );

    this.chargerStationList();

    this.datatable();


    this.idStation = this.idStation1;
    // this.getStation(idStation);
  }

  getStation(idStation) {

    this.stationsService.Get(idStation)
      .subscribe((resp: any) => {
        this.station = resp.stations
        //this.idStation1 =this.station[0].idStation
        // console.log("stationnnnid",   this.station )
        // console.log("stationnnnid",    this.idStation1 )

      },
        (err) => {
        }
      );
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }


  //selectionner note débit crédit
  selectNote(item) {
    this.selectedNote = item
  }


  //selectionner note débit
  selectNoteNd(item) {
    this.selectedNoteD = item
  }


  //selectionner note crédit
  selectNoteNc(item) {
    this.selectedNoteC = item
    //console.log("this.selectedNoteC " ,this.selectedNoteC );
    
  }

  chargerStationList() {
    this.noteDebitCreditService.GetStationsIdName().subscribe(
      res => {
        this.StationList = res as []
     //console.log("StationList", this.StationList)
      }
    )
  }


  datatable() {
    this.dtOptions = {
      destroy: true,
      lengthMenu: [[10, 25, 50], [10, 25, 50]],
      serverSide: true,
      //processing: true,
      // scrollCollapse: true,
      ordering: false,
      searching: false,
      //displayStart: this.renisialiser ? 0 : (this.params['page'] * 10),

      ajax: (dataTablesParameters: any, callback) => {
      this.page = dataTablesParameters.start / dataTablesParameters.length;
        if (this.idStation) {
          this.router.navigate(['NoteDébitCrédit'], {
            queryParams: {
              "page": ( this.page + 1),
              "dateFin": this.datePipe.transform(this.form.get("dateFin").value, 'yyyy-MM-dd'),
              "dateDebut": this.datePipe.transform(this.form.get("dateDebut").value, 'yyyy-MM-dd'),
              "reference": this.form.get("reference").value,
              "code": this.form.get("code").value.trim() === '' ? '' : this.form.get("code").value + '  ',
            }
          })
        }
        else {
          this.router.navigate(['NoteDébitCrédit'], {
            queryParams: {
              "page": ( this.page + 1),
              "type": this.form.get("type").value,
              "dateFin": this.datePipe.transform(this.form.get("dateFin").value, 'yyyy-MM-dd'),
              "dateDebut": this.datePipe.transform(this.form.get("dateDebut").value, 'yyyy-MM-dd'),
              "IdStation": this.form.get("IdStation").value,
              "reference": this.form.get("reference").value,
              "code": this.form.get("code").value.trim() === '' ? '' : this.form.get("code").value + '  ',
            }
          })
        }

        this.noteDebitCreditService.getListNotes(
          {
            "page": ( this.page + 1),
            "size": dataTablesParameters.length,
            "Type": this.form.get("type").value,
            "Statut": this.form.get("Statut").value,
            "IdStation": this.form.get("IdStation").value,
            "Reference": this.form.get("reference").value,
            "code": this.form.get("code").value.trim() === '' ? '' : this.form.get("code").value + '  ',
            "DateFin": this.datePipe.transform(new Date(this.form.get("dateFin").value), 'yyyyMMdd'),
            "DateDebut": this.datePipe.transform(new Date(this.form.get("dateDebut").value), 'yyyyMMdd'),
          }
        ).subscribe((resp: any) => {
          this.ListNotes = resp.data;
          // this.idStation1 =this.ListNotes.idStation
          //console.log("tssst", this.ListNotes )
          this.idStation1 = this.ListNotes[0].idStation
          //console.log('idstation1', this.idStation1);
          this.show = false
          this.showNd = false
          this.showNc = false
          let recordsFiltred = resp.nbTotalResults;
          callback({
            recordsTotal: resp.countAll,

            recordsFiltered: recordsFiltred,
            data: []
          },
            (err) => console.log("err", err));

        });
      },
      language: {
        //processing: "<div style='position: absolute; z-index: 9999;margin-right: 43%;margin-left: 43%;margin-top:-20px;'><img src='assets/img/loader1.gif' style='width:100px;'/></div>",
        search: "Rechercher&nbsp;:",
        lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
        info: "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty: "Affichage de 10 sur 0 &eacute;l&eacute;ments",
        infoFiltered: "",
        infoPostFix: "",
        //loadingRecords: "Chargement en cours...",
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
        // 'copy',
        // 'print',
        // 'excel',
        //'colvis'
      ]
    };
  }


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
    newWin.onafterprint = function () {
    }
  }


  //download le détail de la note débit 
  downlaodNDC() {
    setTimeout(() => {
      this.printContact("iDdIV")
    }, 1000);
  }


  //download le détail de la note débit 
  downlaodND() {
    setTimeout(() => {
      this.printContact("iDdIV2")
    }, 1000);
  }


  //download le détail de la note crédit 
  downlaodNC() {
    setTimeout(() => {
      this.printContact("iDdIV3")
    }, 1000);
  }


  //download le détail de la note crédit débit
  getDetails(reference, id, downlaodNDC) {

    this.TotalTVA = 0
    //console.log(' this.TotalHTVA', this.TotalTVA)
    this.TotalHTVA = 0
    //console.log(' this.TotalHTVA', this.TotalHTVA)
    this.TotalTTC = 0
    //console.log(' this.TotalHTVA', this.TotalTTC)


    if (this.show)
      this.show = false
    else {
      //console.log("this.show",this.show)
      if (this.showNd)
        this.showNd = false


      this.noteDebitCreditService.detail(
        {
          reference: reference,
          id: id,
          "dateDebut": this.selectedNote.date.replace(/-/g, ''),
          idStation: this.selectedNote.idStation


        }
      ).subscribe(async (resp: any) => {

        // console.log("datee ",this.selectedNote.date)
        //console.log("idstationNDC", this.idStation1)

        //console.log("datee2 ",this.tokenService.getUser().idStation)
        this.ListdetailNote = resp[0];
        this.listTransaction = resp[1].result as [];

        this.ListdetailNote.forEach(element => {

          //console.log(' this.TotalHTVA' ,  this.TotalTVA)
          this.TotalTVA += element.mttva
          //console.log(' this.TotalTVA' ,  this.TotalTVA)

          this.TotalHTVA += element.mthtva
          //console.log(' this.this.TotalHTVA' , this.TotalHTVA)

          this.TotalTTC += element.montantttc
          //console.log(' this.TotalTTC' ,  this.TotalTTC)

        });

        const TotalTTCarr = this._decimalPipe.transform((this.TotalTTC), '1.3-3').replace(/,/g, '')
        //console.log("TotalTTCarr",TotalTTCarr);
        
        this.MntTtlNDC = TotalTTCarr  ;
        //console.log(' this.MntTtlNDCstring' ,  this.MntTtlNDC)
        this.MntTtlNDC = NumberToLetter(this.MntTtlNDC)+ " Dinars"
        //console.log(' this.MntTtlNDClettre' ,  this.MntTtlNDC)



        if (downlaodNDC)
          this.downlaodNDC()
        else
          this.show = true
      });
      // console.log("idstationNDC",this.idStation1);
    }
  }

  //afficher le détail de la note débit 
  getDetailsNd(reference, id, idStation, downlaodND) {
    this.getStation(idStation);
    this.TotalTVA = 0
    this.TotalHTVA = 0
    this.TotalTTC = 0
    if (this.showNd)
      this.showNd = false
    else {
      let dateFin = this.datePipe.transform(this.form.get("dateFin").value, 'yyyy-MM-dd')
      let datedebut = this.datePipe.transform(this.form.get("dateDebut").value, 'yyyy-MM-dd')
      this.noteDebitCreditService.detail(
        {
          reference: reference,
          id: id,
          "dateDebut": this.selectedNoteD.date.replace(/-/g, ''),
          idStation: this.selectedNoteD.idStation
        }
      ).subscribe(async (resp: any) => {
        this.ListdetailNoteNd = resp[0];
        this.ListdetailNoteNdcommission = this.ListdetailNoteNd.mthtva;
        // console.log(" this.ListdetailNoteNdcommission", this.ListdetailNoteNdcommission)
        this.listTransaction = resp[1].result as [];
        this.TotalTVA = 0;
        this.TotalHTVA = 0;
        this.TotalTTC = 0;
        this.ListdetailNoteNd.forEach(element => {
          this.TotalTVA += element.mttva
          this.TotalHTVA += element.mthtva
          this.TotalTTC += element.montantttc
        });
        this.TotalTTC = this.TotalTTC;
        this.MntTtlND = NumberToLetter(this._decimalPipe.transform((this.TotalTTC + 1), '1.3-3').replace(/,/g, '')) + " Dinars";
        // console.log('this.MntTtlND',this.MntTtlND)

        this.MntTtlNDnull = NumberToLetter(this._decimalPipe.transform(this.TotalTTC, '1.3-3').replace(/,/g, '')) + " Dinars";
        if (downlaodND)
          this.downlaodND()
        else
          this.showNd = true
      });
      // console.log("idstationND",idStation);

    }
  }

  //afficher le détail de la note crédit 
  getDetailsNc(reference, id, idStation, downlaodNC) {
    //this.getStation(idStation);
    //console.log("id statiooooonnn",idStation)
    this.Total = 0
    if (this.showNc)
      this.showNc = false
    else {
      let dateFin = this.datePipe.transform(this.form.get("dateFin").value, 'yyyy-MM-dd')
      let datedebut = this.datePipe.transform(this.form.get("dateDebut").value, 'yyyy-MM-dd')
      this.noteDebitCreditService.detail(
        {
          reference: reference,
          id: id,
          "dateDebut": this.selectedNoteC.date.replace(/-/g, ''),
          "idStation": this.selectedNoteC.idStation

        }
      ).subscribe((resp: any) => {

        //console.log("id statiooooonnn",this.idStation)

        this.ListdetailNoteNc = resp[0];
        this.listTransaction = resp[1].result as [];

        this.TotalMntNc = 0;
        this.listTransaction.forEach(element => {
          this.TotalMntNc += element.montant
          //console.log("montant",  element.montant)
          //console.log("TotalMntNc", this.TotalMntNc)
        });

        this.Total = 0,
          // this.ListdetailNoteNc.forEach(element => {
          //   this.Total += element.montantttc
          // });

          this.TotalMtva = 0;
          this.ListdetailNoteNc.forEach(element => {
            if(element.mttva != undefined) {
              this.TotalMtva += element.mttva
              //console.log("mttva",  element.mttva)
              //console.log("TotalMtva", this.TotalMtva)
            }
           
        });

        this.TotalMhtva = 0;
        this.ListdetailNoteNc.forEach(element => {
          
          this.TotalMhtva += element.mthtva
          //console.log("mthtva",  element.mthtva)
          //console.log("TotalMhtva", this.TotalMhtva)
        });

        this.Total = this.TotalMhtva + this.TotalMtva;
        //console.log("Total",this.Total);
        
        this.MntTtlNC = NumberToLetter(this._decimalPipe.transform(this.Total, '1.3-3').replace(/,/g, '')) + " Dinars";
        //console.log("MntTtlNC",this.MntTtlNC );

        this.dtTrigger2.next();

        //console.log(this.dtElement.dtInstance)
        if (downlaodNC)
          this.downlaodNC()
        else
          this.showNc = true
      });
      ///console.log("idstationNc", this.idStation1);
    }
  }
  


  rerender(): void {
    this.show = false;
    // console.log("renisialiser")
    this.renisialiser = true
    this.datatable()
    this.show = false
    this.showNd = false
    this.showNc = false
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
   
  }

  get f() { return this.form.controls };



}


function NumberToLetter(nombre, U = null, D = null) {

  var letter = {
    0: "zéro",
    1: "un",
    2: "deux",
    3: "trois",
    4: "quatre",  
    5: "cinq",
    6: "six",
    7: "sept",
    8: "huit",
    9: "neuf",
    10: "dix",
    11: "onze",
    12: "douze",
    13: "treize",
    14: "quatorze",
    15: "quinze",
    16: "seize",
    17: "dix-sept",
    18: "dix-huit",
    19: "dix-neuf",
    20: "vingt",
    30: "trente",
    40: "quarante",
    50: "cinquante",
    60: "soixante",
    70: "soixante-dix",
    80: "quatre-vingt",
    90: "quatre-vingt-dix",
  };

  

  var i, j, n, quotient, reste, nb;
  var ch
  var numberToLetter = '';
  //__________________________________
  //console.log("nombreNDC",nombre);

  if (nombre.toString().replace(/ /gi, "").length > 15) return "dépassement de capacité";
  ///console.log("nombreNDC",nombre);

  if (isNaN(nombre.toString().replace(/ /gi, ""))) return "Nombre non valide";
  ///console.log("nombreNDC2",nombre);

  nb = parseFloat(nombre.toString().replace(/ /gi, ""));
  

  //if (Math.ceil(nb) != nb) return "Nombre avec virgule non géré.";
  
  if (Math.ceil(nb) != nb) {
    nb = nombre.toString().split('.');
    //return NumberToLetter(nb[0]) + " virgule " + NumberToLetter(nb[1]);
    return NumberToLetter(nb[0]) + (U ? " " + U + " et " : " virgule ") + NumberToLetter(nb[1]) + (D ? " " + D : "");
  }

  n = nb.toString().length;
  switch (n) {
    case 1:
      numberToLetter = letter[nb];
      break;
    case 2:
      if (nb > 19) {
        quotient = Math.floor(nb / 10);
        reste = nb % 10;
        if (nb < 71 || (nb > 79 && nb < 91)) {
          if (reste == 0) numberToLetter = letter[quotient * 10];
          if (reste == 1) numberToLetter = letter[quotient * 10] + "-et-" + letter[reste];
          if (reste > 1) numberToLetter = letter[quotient * 10] + "-" + letter[reste];
        } else numberToLetter = letter[(quotient - 1) * 10] + "-" + letter[10 + reste];
      } else numberToLetter = letter[nb];
      break;
    case 3:
      quotient = Math.floor(nb / 100);
      reste = nb % 100;
      if (quotient == 1 && reste == 0) numberToLetter = "cent";
      if (quotient == 1 && reste != 0) numberToLetter = "cent" + " " + NumberToLetter(reste);
      if (quotient > 1 && reste == 0) numberToLetter = letter[quotient] + " cents";
      if (quotient > 1 && reste != 0) numberToLetter = letter[quotient] + " cent " + NumberToLetter(reste);
      break;
    case 4:
    case 5:
    case 6:
      quotient = Math.floor(nb / 1000);
      reste = nb - quotient * 1000;
      if (quotient == 1 && reste == 0) numberToLetter = "mille";
      if (quotient == 1 && reste != 0) numberToLetter = "mille" + " " + NumberToLetter(reste);
      if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " mille";
      if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " mille " + NumberToLetter(reste);
      break;
    case 7:
    case 8:
    case 9:
      quotient = Math.floor(nb / 1000000);
      reste = nb % 1000000;
      if (quotient == 1 && reste == 0) numberToLetter = "un million";
      if (quotient == 1 && reste != 0) numberToLetter = "un million" + " " + NumberToLetter(reste);
      if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " millions";
      if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " millions " + NumberToLetter(reste);
      break;
    case 10:
    case 11:
    case 12:
      quotient = Math.floor(nb / 1000000000);
      reste = nb - quotient * 1000000000;
      if (quotient == 1 && reste == 0) numberToLetter = "un milliard";
      if (quotient == 1 && reste != 0) numberToLetter = "un milliard" + " " + NumberToLetter(reste);
      if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " milliards";
      if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " milliards " + NumberToLetter(reste);
      break;
    case 13:
    case 14:
    case 15:
      quotient = Math.floor(nb / 1000000000000);
      reste = nb - quotient * 1000000000000;
      if (quotient == 1 && reste == 0) numberToLetter = "un billion";
      if (quotient == 1 && reste != 0) numberToLetter = "un billion" + " " + NumberToLetter(reste);
      if (quotient > 1 && reste == 0) numberToLetter = NumberToLetter(quotient) + " billions";
      if (quotient > 1 && reste != 0) numberToLetter = NumberToLetter(quotient) + " billions " + NumberToLetter(reste);
      break;
  }//fin switch
  /*respect de l'accord de quatre-vingt*/
  if (numberToLetter.substr(numberToLetter.length - "quatre-vingt".length, "quatre-vingt".length) == "quatre-vingt") numberToLetter = numberToLetter + "s";

  return numberToLetter;

}