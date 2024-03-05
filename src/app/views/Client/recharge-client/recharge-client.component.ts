import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';

import { Component, OnInit, ViewChild, ElementRef, HostListener, Output, HostBinding, EventEmitter } from '@angular/core';
import { HttpEventType, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { DatePipe, DOCUMENT } from '@angular/common';
import { reverse } from 'dns';
import { Console } from 'console';

@Component({
  selector: 'app-recharge-client',
  templateUrl: './recharge-client.component.html',
  styleUrls: ['./recharge-client.component.scss']
})
export class RechargeClientComponent implements OnInit {
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
  isImageValid: boolean = false;
  dateString: any;
  client: any;
  joursPourEcheance: any = 0;
  chequeFlag: boolean;
  cheque: any;
  form2: FormGroup;
  confirmFlag: boolean;
  numCompte: String;
  disableButton: boolean = false;
  constructor(private route: ActivatedRoute, 
    private clientService: ClientService,
     private router: Router,
      private fb: FormBuilder, 
      private toasterService: ToasterService, 
      private datePipe: DatePipe,
      ) { }
  RechargeClientForm: any
  fileData: File = null;
  imagePreview: string | ArrayBuffer;

  blocked=false
  bankss = [];
  //RaisonSociale :any

  addItem(event) {

    this.fileRequerd = false
    this.file = event;

  }

  showFileAndDate() {
    this.file = null;
    this.RechargeClientForm.controls.dateEcheance.setValue(null)
    if (this.RechargeClientForm.value.typePayement == 'chèque' || this.RechargeClientForm.value.typePayement == 'cheque' ||this.RechargeClientForm.value.typePayement == 'traite') {
      //console.log("typePayement", this.RechargeClientForm.value)
      this.RechargeClientForm.get('dateEcheance').setValidators(Validators.required)
      this.RechargeClientForm.get('dateEcheance').updateValueAndValidity();
      this.RechargeClientForm.get('reference').clearValidators()
      this.RechargeClientForm.get('reference').updateValueAndValidity();
    }
    else {
      this.RechargeClientForm.get('dateEcheance').clearValidators()
      this.RechargeClientForm.get('dateEcheance').updateValueAndValidity();
      this.RechargeClientForm.get('reference').setValidators(Validators.required)
      this.RechargeClientForm.get('reference').updateValueAndValidity()

    }
    this.calculateDateEchiance();

    //console.log(this.RechargeClientForm.get('dateEcheance'))
  }

  ngOnInit() {

    this.clientService.getAllBanks().subscribe(
      (resp: any) => {
        this.bankss = resp;
        //console.log("banques", this.bankss);
      }
    )
    this.chequeFlag = false
    this.confirmFlag = false
    //console.log("Raison sociale est " + this.RaisonSociale)
    this.dateString = this.datePipe.transform(new Date(), "yyyy-MM-dd")
    this.idClient = this.route.snapshot.paramMap.get('id')
    //console.log("hello ! ")
    this.getClientWithSolde();
    this.RechargeClientForm = this.fb.group({
      "numCompte": "",
      "montant": [, [Validators.required, Validators.min(10)]],
      "montantRecharge": [, [Validators.required, Validators.min(10)]],
      "typeCompte": "",
      "typePayement": "",
      "dateEcheance": [{ value: this.dateString, disabled: true },],
      "dateEcheance2": "",
      "NumChequeTraite": "",
      "justicatifFile": "",
      "echeance": "",
      "expirationGrantie": "",
      "clientId": this.idClient,
      "Date": this.dateString,
      "NumBon": "",
      "RaisonSociale": "",
      "FileName": "",
      // "reference": [, [Validators.required, Validators.min(10)]],
      "banque": [,[Validators.required]],
      "reference": [, [Validators.required]],
      "imagePJ":[""]
    });



  }

  deleteItem($event) {
    this.file = null
  }

  calculateDateEchiance() {
    if (this.f.typePayement.value == 'chèque' || this.f.typePayement.value == 'cheque'||this.f.typePayement.value == 'traite') {
      if (this.f.typeCompte.value == '20')
        this.RechargeClientForm.patchValue({
          dateEcheance: this.dateString
        })
      else if (this.f.typeCompte.value == '21') {
        let date = new Date();
        date.setDate(date.getDate() + this.joursPourEcheance)
        //console.log(date)
        this.RechargeClientForm.patchValue({
          dateEcheance: this.datePipe.transform(date, "yyyy-MM-dd")
        })
        //console.log(this.f.dateEcheance.value)
      }


    }
  }


   // Define the openFileInput method
   openFileInput() {
    // Get a reference to the hidden file input element
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;

    // Trigger a click event on the file input to open the file dialog
    if (fileInput) {
      fileInput.click();
    }
  }


  fileProgress(fileInput: any) {

    this.fileData = <File>fileInput.target.files[0];

}


fileChange(event: any) {
  //console.log("event", event);
  const file = event.target.files[0];

  if (file) {
    const fileType = file.type;

    // Vérification du type de fichier
    if (fileType == 'image/jpeg' || fileType == 'image/jpg' || fileType == 'image/png') {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imagePreview = reader.result;
        this.isImageValid = true;
        //console.log("this.imagePreview", this.imagePreview);
      };
    } else {
      
      this.isImageValid = false;
      this.imagePreview = null;
      console.error('Type de fichier non accepté');
      this.toasterService.pop('error', '', "Le format de fichier n'est pas autorisé. Veuillez insérer un fichier aux formats JPEG, JPG ou PNG");
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
    this.clientService.uploadFile(formData).subscribe((res: HttpEvent<any>) => {
      this.isValid = true
      if (res.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * res.loaded / res.total);
      }
      else if (res.type === HttpEventType.Response) {
        this.progress = 100;
        this.message = 'téléchargement réussi';
        this.RechargeClientForm.value.justicatifFile = res.body.fileName
        this.RechargeClientForm.patchValue({
          FileName: res.body.fileName
        })
        //console.log("test amni11111")
        this.DemandeRecharge(event)
      }
    //  console.log("test amni11")
      this.disableButton = false;
     // console.log("test amni22")
    }
      ,
      (err) => {
        //console.log(err);

        this.toasterService.pop('error', '', err)
      })
  }


  get f() { return this.RechargeClientForm.controls };



  checkfile() {
    //console.log("ddddddddddddddddddddddddddddddddd",this.RechargeClientForm.value);
    
    // console.log("testmontant", this.RechargeClientForm.value.montant)
    if (((this.RechargeClientForm.value.typePayement == "chèque" || this.RechargeClientForm.value.typePayement == "cheque" ||this.RechargeClientForm.value.typePayement == "traite" ) && this.file == null))
     {
    //  console.log("testmontant" , this.RechargeClientForm.value.typePayement)

      this.fileRequerd = true
      this.ConfirmRechargeModal.show()
     } 
        
    
      //controle sur PPE
    else {
      //if (this.RechargeClientForm.value.typeCompte == "21" && (this.RechargeClientForm.value.montant <= this.client.dmappe)) {
      if (this.RechargeClientForm.value.typeCompte == "21" ) {
        this.ConfirmRechargeModal.show()
      }
      
      // else
      //   if (this.RechargeClientForm.value.typeCompte == "21" && (this.RechargeClientForm.value.montant > this.client.dmappe)) {
      //     this.toasterService.pop('error', '', 'le montant de paiement est supérieur au dma PPE.')
      //   }
    }
    if (this.RechargeClientForm.value.typeCompte == "20") {
      this.ConfirmRechargeModal.show()
     
    }

    this.numCompte = this.RechargeClientForm.value.numCompte;
  }

  checkandSave(event) {
    this.disableButton = true;
    this.blocked = true
   
    if (this.file) {
      this.uploadFile(this.file);
      
    }
    else {
      
      this.DemandeRecharge(event)
    }
  }

  ConfirmRecharge(event) {
    //console.log('test1');
    
    this.disableButton = true;
    this.blocked = true
    this.confirmFlag = event
    //console.log("test test1")
    //mochkel houni
    // this.clientService.DemandeRecharge(this.RechargeClientForm.getRawValue()).subscribe(
    //   (res: any) => {
    //     setTimeout(() => {
    //       this.RechargeClientForm.patchValue(
    //         {
    //           RaisonSociale: this.client.raisonSociale,
    //           NumBon: res.result.bonRecharge,
    //           Date: this.dateString,
    //           echeance: this.client.echeance,
    //           expirationGrantie: this.client.expirationGrantie,

    //           // reference :res.result.reference
    //         }

    //       )
    //     }, 2000)
    //     //console.log("numbon", res.result.bonRecharge);
    //     //console.log("RechargeClientForm.echeance", this.RechargeClientForm.echeance.value)
    //     // setTimeout(() => {
    //     //   //this.printContact("iDdIV")
    //     // }, 1000);
    //     console.log("test test1")
    //     this.toasterService.pop("success", "recharge effectué avec succés");
    //     this.ConfirmRechargeModal.hide()
    //     setTimeout(() => { this.router.navigate(['/client/list']) }, 2000)
    //     //  this.router.navigate(['/client/list']);
    //   },
    //   (err: any) => {
    //     this.toasterService.pop("error", err.error);
    //   }
    // )
  }

  DemandeRecharge(event) {

    this.disableButton = true;

    this.blocked = true
    if (event == 'true' && this.RechargeClientForm.value.typePayement != 'espèce' && this.RechargeClientForm.value.typePayement != 'virement') {
        this.chequeFlag = true
      this.ConfirmRecharge(event);
     
    }

   let form2 = this.RechargeClientForm.getRawValue()
    //console.log("form.imagePJformformform", form2 )
    form2.imagePJ = this.imagePreview;
    //console.log("form.imagePJ", form2.imagePJ )
    this.clientService.DemandeRecharge(form2).subscribe(
      (res: any) => {
        if (res.data == "Chèque existant" && this.chequeFlag == false) {
         
          this.cheque = res.result
          //console.log("==============>cheque", this.cheque )
          this.chequeFlag = true;
          return
        }
        setTimeout(() => {
          this.RechargeClientForm.patchValue(
            {
              RaisonSociale: this.client.raisonSociale,
              NumBon: res.result.bonRecharge,
              Date: this.dateString,

              // reference :res.result.reference
            }
          )
        },2000)
        this.ConfirmRechargeModal.hide()
        setTimeout(() => { this.router.navigate(['/client/list']) }, 2000)
        this.toasterService.pop("success", "recharge effectué avec succés");
        if (this.RechargeClientForm.value.typeCompte == "21" && (this.RechargeClientForm.value.montant > this.client.dmappe && this.RechargeClientForm.value.montant > this.client.dmappe)) {
          this.toasterService.pop('error', '', 'le montant de paiement est supérieur au dma PPE.')
        }

        if (this.RechargeClientForm.value.typeCompte == "21" && (this.RechargeClientForm.value.montant > this.client.dmappe && this.RechargeClientForm.value.montantRecharge > this.client.dmappe)) {
          this.toasterService.pop('error', '', 'le montant de recharge est supérieur au dma PPE.')
        }

        if (this.RechargeClientForm.value.dateEcheance2 != this.RechargeClientForm.value.dateEcheance) {
          this.toasterService.pop("success", "La date d’échéance est différente de la date du chèque. ")
        } else {
          this.toasterService.pop("error", "La date d’échéance est égale à la date du chèque. ")
        }

        if (this.RechargeClientForm.value.montant > this.RechargeClientForm.value.montantRecharge) {
          this.toasterService.pop("success", "le montant de paiement est supérieur au montant de recharge ")
        } else {
          this.toasterService.pop("success", "le montant de paiement est inférieur au montant de recharge ")

        }

        // this.toasterService.pop("success", "Pas de dépassement DMA")
      },
      (err: any) => {
      
        this.toasterService.pop('error', '', "Vous possédez déjà un bon qui n'a pas encore été clôturé.");
        ;
    
        setTimeout(() => {
          window.location.reload();
        }, 5000);
        
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
    // setTimeout(function() {
    //   newWin.close();
    // }, 1000);
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

 showToast(message, duration) {
    // Créez l'élément de pop-up
    var toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;
  
    // Ajoutez le pop-up à la page
    document.body.appendChild(toast);
  
    // Supprimez le pop-up après la durée spécifiée
    setTimeout(function () {
      toast.remove();
    }, duration);
  }
  
  // Exemple d'utilisation
  
  
  

}
