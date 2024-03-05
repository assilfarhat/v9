import { Component, Input, OnInit } from '@angular/core';
import { SuiviTransactionsService } from 'app/services/suivi-transactions.service';
import { TokenService } from 'app/services/token.service';

@Component({
  selector: 'app-transactions-note-debit-credit',
  templateUrl: './transactions-note-debit-credit.component.html',
  styleUrls: ['./transactions-note-debit-credit.component.scss']
})
export class TransactionsNoteDebitCreditComponent implements OnInit {
@Input() date;
  listTransaction: any=[];

constructor( private tokenService: TokenService, private suiviTransactionsService: SuiviTransactionsService) { }

  ngOnInit() {
  }


  gettransactions(){
    this.suiviTransactionsService.filtreTransactions(
      {
      
        "dateFin":  this.date.replace(/-/g, '') ? this.date.replace(/-/g, '') + '235959999' : '99990101235959999',
        "dateDebut":this.date.replace(/-/g, '') ? this.date.replace(/-/g, '') + '000000000' : '10000101000000000',
        "idStation": this.tokenService.getUser().idStation
      
      }
    ).subscribe((resp: any) => {
      this.listTransaction = resp.data;

     } ,(err) => {
  
      }
      ); 
   }
    

}
