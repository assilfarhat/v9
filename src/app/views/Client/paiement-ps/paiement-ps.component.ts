import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';

import { Component, OnInit, ViewChild, ElementRef, HostListener, Output, HostBinding, EventEmitter } from '@angular/core';
import { HttpEventType, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { DatePipe, DOCUMENT } from '@angular/common';
import { log } from 'console';


@Component({
  selector: 'app-paiement-ps',
  templateUrl: './paiement-ps.component.html',
  styleUrls: ['./paiement-ps.component.scss']
})
export class PaiementPSComponent implements OnInit {

  @ViewChild('ConfirmRechargeModal') ConfirmRechargeModal;
  idClient
  public progress: number;
  public message: string;
  isValid = false;
  test = true;
  file = null
  fileRequerd = false
  recharge: any;
  statusPP: any;
  statusPsP: any;
  statusPPE: any;
  date: Date;
  dateString: any;
  client: any;
  joursPourEcheance: any = 0;
  chequeFlag: boolean;
  cheque: any;
  confirmFlag: boolean;
  constructor(private route: ActivatedRoute, private clientService: ClientService, private router: Router, private fb: FormBuilder, private toasterService: ToasterService, private datePipe: DatePipe) { }
  RechargeClientForm: any
  //RaisonSociale :any

  addItem(event) {
    this.fileRequerd = false
    this.file = event;
  }

  showFileAndDate() {
    this.file = null;

    this.RechargeClientForm.controls.dateEcheance.setValue(null)
    if (this.RechargeClientForm.value.typePayement == 'cheque' || this.RechargeClientForm.value.typePayement == 'traite') {
      this.RechargeClientForm.get('dateEcheance').setValidators(Validators.required)
      this.RechargeClientForm.get('dateEcheance').updateValueAndValidity();
    }
    else {
      this.RechargeClientForm.get('dateEcheance').clearValidators()
      this.RechargeClientForm.get('dateEcheance').updateValueAndValidity();
    }
    this.calculateDateEchiance();

    //console.log(this.RechargeClientForm.get('dateEcheance'))
  }

  ngOnInit() {
    this.chequeFlag = false
    this.confirmFlag = false
    //console.log("Raison sociale est " + this.RaisonSociale)


    this.dateString = this.datePipe.transform(new Date(), "dd-MM-yyyy")
    //console.log("Raison sociale est " , this.dateString)

    this.idClient = this.route.snapshot.paramMap.get('id')

    this.getClientWithSolde()

    this.RechargeClientForm = this.fb.group({
      "numCompte": "",
      "montant": [, [Validators.required, Validators.min(10)]],
      "typeCompte": "",
      "typePayement": "",
      "dateEcheance": [{ value: this.dateString, disabled: true },],
      "dateEcheance2": "",
      "NumChequeTraite": "",
      "justicatifFile": "",
      "clientId": this.idClient,
      "Date": this.dateString,
      "NumBon": "",
      "RaisonSociale": "",
      "reference": [, [Validators.required, Validators.min(10)]],
    });



  }

  deleteItem($event) {
    this.file = null
  }

  calculateDateEchiance() {
    //console.log("dateEcheance: this.dateString",this.dateString)
    if (this.f.typePayement.value == 'cheque' || this.f.typePayement.value == 'traite') {
      if (this.f.typeCompte.value == '20')
        this.RechargeClientForm.patchValue({
          dateEcheance: this.dateString,
         
          
        })
       
      else if (this.f.typeCompte.value == '21') {
        let date = new Date();
        date.setDate(date.getDate() + this.joursPourEcheance)
       // console.log(date)
        this.RechargeClientForm.patchValue({
          dateEcheance: this.datePipe.transform(date, "dd-MM-yyyy")

        })
       // console.log(this.f.dateEcheance.value)
      }


    }
  }



  onError(event) {

  }
  exitEditor(event) {

  }

  editResult(event) {

  }
  editorState(event) {

  }



  public uploadFile = (files) => {

    if (files.length === 0) {
      return;
    }

    // console.log(files)
    // let fileToUpload = <File>files[0];
    // console.log(fileToUpload)
    const formData = new FormData();
    formData.append('file', files, files.name);
    // Récupérez le fichier depuis le FormData
    const uploadedFile = formData.get('file');

    // Récupérez le nom du fichier
    const fileName =  files.name;
    //console.log("CfileName.",fileName);
    // Obtenez l'extension du fichier (en supposant que l'extension est après le dernier point)
    const fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
    //console.log("CfileExtensionF.",fileExtension);
    
    if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'pdf') {
      
    this.clientService.uploadFile(formData)
      .subscribe((res: HttpEvent<any>) => {
        this.isValid = true
        if (res.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * res.loaded / res.total);
          //console.log(this.progress)
        }
        else if (res.type === HttpEventType.Response) {
          this.progress = 100;
          this.message = 'téléchargement réussi';
          this.RechargeClientForm.value.justicatifFile = res.body.fileName
          //console.log(res)
          this.demandePaiement(event)
        }


      }
    
    
        ,
        (err) => {
          //console.log(err);

          this.toasterService.pop('error', '', err.error.value);
        })}
        else {
          
          this.toasterService.pop('error', '', 'Le type de fichier incorrecte.')
        }
  }


  get f() { return this.RechargeClientForm.controls };



  checkfile() {

    if ((this.RechargeClientForm.value.typePayement == "cheque" || this.RechargeClientForm.value.typePayement == "traite") && this.file == null)
      this.fileRequerd = true
    else
      this.ConfirmRechargeModal.show()
    // this.printContact("component1")
    // this.onafterprint();
  }




  checkandSave(event) {
    if (this.file) {

      this.uploadFile(this.file);
    }
    else {
      this.demandePaiement(event)
    }

  }

  ConfirmRecharge(event) {
    this.confirmFlag = event

    this.clientService.demandePaiement(this.RechargeClientForm.getRawValue()).subscribe(

      (res: any) => {

       // console.log("Client raison sociale " + this.client.raisonSociale)
        //  setTimeout(()=>{
        //   this.RechargeClientForm.patchValue(
        //     {
        //       RaisonSociale: this.client.raisonSociale,
        //       NumBon :res.result.bonRecharge,
        //       Date:this.dateString,
        //       // reference :res.result.reference
        //     }
        //   )},1000)
        //  setTimeout(()=>{
        //   this.printContact("iDdIV")

        //  }, 1000);

       // this.ConfirmRechargeModal.show()
        this.ConfirmRechargeModal.hide()
        setTimeout(() => { this.router.navigate(['/client/list']) }, 1000)
        //  this.router.navigate(['/client/list']);

        this.toasterService.pop("success", res.data);


      },
      (err: any) => {

        this.toasterService.pop("error", err.error);
      }


    )


  }

  demandePaiement(event) {
    if (event == 'true' && (this.RechargeClientForm.value.typePayement != 'espece' || this.RechargeClientForm.value.typePayement != 'espèce')) {
      this.chequeFlag = true
      this.ConfirmRecharge(event);
    }
    //console.log("resultat est " + event)
    this.clientService.demandePaiement(this.RechargeClientForm.getRawValue()).subscribe(
      (res: any) => {
        if (res.data == "Chèque existant" && this.chequeFlag == false) {
          this.cheque = res.result
          this.chequeFlag = true;
          //console.log("Confirm flag is " + this.confirmFlag)
          return
          //console.log("res chèqe existant")
        }
        //console.log("Client raison sociale " + this.client.raisonSociale)
        setTimeout(() => {
          this.RechargeClientForm.patchValue(
            {
              RaisonSociale: this.client.raisonSociale,
              codeclient : this.client.codeclient,
              NumBon: res.result.bonRecharge,
              Date: this.dateString,
              // reference :res.result.reference
            }
          )
        }, 1000)
        setTimeout(() => {
          this.printContact("iDdIV")

        }, 1000);


        this.ConfirmRechargeModal.hide()
        setTimeout(() => { this.router.navigate(['/client/list']) }, 1000)
        //  this.router.navigate(['/client/list']);

        this.toasterService.pop("success", res.data);


      },
      (err: any) => {

        this.toasterService.pop("error", err.error);
      }


    )
  }


  patchNumCompte(client) {
    this.statusPP = client.statusPP == "0" ? false : true
    this.statusPPE = client.statusPPE == "0" ? false : true
    this.statusPsP = client.statusPsP == "0" ? false : true
    //console.log(client)
    this.joursPourEcheance = client.echeance
    this.RechargeClientForm.patchValue(
      {
        numCompte: client.numCompte

      }

    )
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

    // newWin.onafterprint=function(){

    // }


  }
  getClientWithSolde() {
    this.clientService.GetClientWithSoldee(this.idClient).subscribe(
      (res: any) => {

        this.client = res
        // this.RaisonSociale= this.client.raisonSociale

      })
  }
  //  public uploadBonPaiement = (files) => {

  //   if (files.length === 0) {
  //     return;
  //   }

  //   // console.log(files)
  //   // let fileToUpload = <File>files[0];
  //   // console.log(fileToUpload)
  //   const formData = new FormData();
  //    var name = this.RechargeClientForm.value.NumBon
  //   formData.append(name, files, files.name);




  //   this.clientService.uploadBon(formData)
  //       .subscribe((res: HttpEvent<any>) => {
  //         this.isValid = true




  //         if (res.type === HttpEventType.UploadProgress) {

  //           this.progress = Math.round(100 * res.loaded / res.total);
  //           console.log(this.progress)
  //         }
  //         else if (res.type === HttpEventType.Response) {
  //             this.progress=100;
  //              this.message = 'téléchargement réussi';
  //             // this.ConfirmRechargeModal.hide()
  //              //this.router.navigate(['/client/list']);
  //                           // this.onUploadFinished.emit(res.body);

  //         }
  //         // this.fileInput.nativeElement.value = '';

  //       }
  //         ,
  //         (err) => {
  //           console.log(err);

  //           this.toasterService.pop('error', '', err.error.value);
  //         })
  //   }

}
