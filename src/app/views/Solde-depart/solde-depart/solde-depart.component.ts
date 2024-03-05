import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { ClientService } from 'app/services/client.service';
import { TokenService } from 'app/services/token.service';

@Component({
  selector: 'app-solde-depart',
  templateUrl: './solde-depart.component.html',
  styleUrls: ['./solde-depart.component.scss']
})
export class SoldeDepartComponent implements OnInit {

  ActualUser: string = "";
  statusPP: string;
  statusPPE: string;
  statusPsP: string;
  idClient: any;
  selectedClient: any;
  ClientList: any;
  isLoading: boolean = false;
  ClientListDropdown: any = [];
  formSearch: FormGroup;
  client: any = {};
  clientACaculer: any;


  constructor(private _decimalPipe: DecimalPipe, private tokenService: TokenService, public dialog: MatDialog, private clientService: ClientService, private router: Router, private fb: FormBuilder, private toasterService: ToasterService) {

  }
  ngOnInit() {
    this.ActualUser = this.tokenService.getRole();
    this.chargerClientListDropdown();

    this.formSearch = this.fb.group({
      clientId: [{ value: "", disabled: false }],
      "PlafondPPE": [{ value: "", disabled: true }],
      "PlafondPP": [{ value: "", disabled: true }],
      "PlafondDepartPP": [{ value: "", disabled: false }],
      "PlafondDepartPPE": [{ value: "", disabled: false }],
      "TypePayement": [{ value: 'SoldeDepart', disabled: false }]
    });
  }

  chargerClientListDropdown() {
    this.clientService.GetClientsIdName().subscribe(
      res => {
        this.ClientListDropdown = res as [];
      }
    )
  }

  getListClients() {
    let search = JSON.parse(JSON.stringify(this.formSearch.value));
  }

  selectFile() {
    this.selectedClient = this.formSearch.controls['clientId'].value;
    this.getClientAndCarteWithSolde();
  }
  ConfirmRecharge() {
    let search = JSON.parse(JSON.stringify(this.formSearch.value))
    // console.log(search);

    this.router.navigate(['/soldedepart'], {
      queryParams: {
        clientId: this.formSearch.value.clientId,
        "PlafondDepartPP": this.formSearch.value.PlafondDepartPP,
        "PlafondDepartPPE": this.formSearch.value.PlafondDepartPPE,
        "TypePayement": this.formSearch.value.TypePayement,
      }
    });
    this.clientService.DemandeSoldeDepart(search).subscribe(
      (res: any) => {
        this.toasterService.pop("success", "Insertion solde départ effectué avec succés");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
        this.formSearch.patchValue({
          PlafondDepartPP: [],
          PlafondDepartPPE: []
        });
      },
      (err: any) => {
        this.toasterService.pop("error", err.error);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    )
  }

  calculateSoldeDispo() {
    this.formSearch.patchValue({
      PlafondPPE: [this.clientACaculer.soldePPE],
      PlafondPP: [this.clientACaculer.soldePP],
      PlafondDepartPP: [],
      PlafondDepartPPE: []
    });
  }

  getClientAndCarteWithSolde() {
    this.clientService.getClientCarteWithSoldeForDepart(this.selectedClient).subscribe(
      (res: any) => {
        this.client = res[0]
        this.clientACaculer = JSON.parse(JSON.stringify(res[0]))
        this.calculateSoldeDispo();

      })
  }

  sendTypingEvent() {
    if (this.formSearch.value.PlafondDepartPPE !== undefined && this.formSearch.value.PlafondDepartPPE !== null) {
      var PlafondDepartPPE = this._decimalPipe.transform(this.formSearch.value.PlafondDepartPPE, '1.3-3')
      // console.log(PlafondDepartPPE)
      // this.formSearch.patchValue({
      //   PlafondDepartPP: [],
      //   PlafondDepartPPE: [PlafondDepartPPE]
      // });
    }


  }
}
