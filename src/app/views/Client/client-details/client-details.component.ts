import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from 'app/services/client.service';
import { AmountPipe } from 'app/pipes/amount.pipe';
import { Subject } from 'rxjs';
import { TokenService } from 'app/services/token.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {
  client;
  Fluxps:any;
  Actif:any;
  Assurance:any;
  Autre:any;
  soldePsP:number;
  DemandeReglementList: any;
  dtTrigger = new Subject();
  accesView:  any[] = [];
  DemandeReglementList2: any;
  NoDataMessage: boolean;
  constructor(private tokenService: TokenService ,private route: ActivatedRoute, private clientService: ClientService) { }

  ngOnInit() {
    this.getClientDetails();
    this.chargerDemandeReglementList();
    this.accesView =this.tokenService.getAccess();

  }

  chargerDemandeReglementList() {
    // this.reinitialiser()
    this.clientService.listReglement(this.route.snapshot.paramMap.get('id')).subscribe((
      res: any )=> {
        
        this.DemandeReglementList = res
        this.DemandeReglementList2 = res.filter((result: any) => {
          return (
            result.statusBank == 'En portefeuille' || result.statusBank ==null
          );
        });
        //console.log("DemandeReglementList2" , this.DemandeReglementList2)
        
        if (!this.DemandeReglementList2 || this.DemandeReglementList2.length == 0) {
          this.NoDataMessage = true;
        } else {
          this.NoDataMessage = false;
        }
        
      }
    )

  }

  getClientDetails() {
    this.clientService.getClientDetails(this.route.snapshot.paramMap.get('id')).subscribe(
      (res: any) => {
       // console.log("res",res)
        this.client = res
        this.Fluxps= this.client.fluxPs;
        this.Actif=this.client.actif;
        this.client.plafondPs = this.client.plafondPs == null ? 0 : this.client.plafondPs;
        this.client.EncoursPs = this.client.encoursPs == null ? 0 : this.client.encoursPs;
        this.soldePsP=this.client.plafondPs - this.client.encoursPs ;
        this.Autre=this.client.autre;
      })
  }
}

