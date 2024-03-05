
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuiviTransactionsService {

constructor(private http: HttpClient) { }

exporttoexcelTransaction(model){
  return this.http.post(environment.api_url + '/api/LogTransactions/GetLogTransactionExportExcel', model);
}
listeTransaction(model){
  return this.http.post(environment.api_url + '/api/LogTransactions/GetLogTransaction', model);
}

ListeTransactionClients(model){
  return this.http.post(environment.api_url + '/api/LogTransactions/GetLogTransactionClients', model);
}

ListeRechargeClients(model){
  return this.http.post(environment.api_url + '/api/LogTransactions/GetLogRechargeClients', model);
}



filtreTransactions(model) {
  return this.http.post(environment.api_url + '/api/LogTransactions', model);
}

filtreTransactionsRecharges(model) {
  return this.http.post(environment.api_url + '/api/LogTransactions/GetLogTransactionRecharge', model);
}
GetLogTransactionByStationAndDate(model) {
  return this.http.post(environment.api_url + '/api/GetLogTransactionByStationAndDate', model);
}

GetStationsIdName() {
  return this.http.get(environment.api_url + '/api/LogTransactions/GetStationsIdName');
}

getLogTransactionRecharge(model) {
  return this.http.post(environment.api_url + '/api/LogTransactions/GetLogTransactionRecharge', model);
}

}