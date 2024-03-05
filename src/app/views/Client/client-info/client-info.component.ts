import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss']
})
export class ClientInfoComponent implements OnInit {
  @Input() idClient;
  client
  montantAutorisePpe: number;
  montantAutorisePS : number;
  @Output() sendNumCompteEvent = new EventEmitter<string>();


  constructor(private clientService: ClientService) { }
  ngOnChanges(changes: SimpleChanges) {

    // this.doSomething(changes.categoryId.currentValue);

    this.clientService.GetClientWithSoldee(changes.idClient.currentValue).subscribe(
      (res: any) => {
        this.client = res
        //this.montantAutorisePpe = this.client.dmappe - this.client.encoursPpe
        
        this.sendNumCompteEvent.emit(this.client);
      })

    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

  }
  ngOnInit() {
    //console.log("test componenet " + this.idClient)
    this.getClientWithSolde();
  }

  getClientWithSolde() {
    this.clientService.GetClientWithSoldee(this.idClient).subscribe(
      (res: any) => {
        this.client = res
        this.montantAutorisePpe = this.client.dmappe - this.client.encoursPpe
        this.montantAutorisePS = this.client.dmaps - this.client.encoursPs
        //console.log("dmapp" ,this.client.dmapp)
        this.sendNumCompteEvent.emit(this.client);
      })
  }
}
