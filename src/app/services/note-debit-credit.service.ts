

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteDebitCreditService {

  constructor(private http: HttpClient) { }
  getListNotes(model) {

    return this.http.post(environment.api_url + '/api/NoteDebitCredits', model);
  }

  GetStationsIdName() {
    return this.http.get(environment.api_url + '/api/NoteDebitCredits/GetStationsIdName');
  }
  

  getDEtailDC(model) {
    return this.http.get(environment.api_url + '/api/NoteDebitCredits/detail/' + model.id);
  }
  public detail(model): Observable<any[]> {
    var note = this.http.get(environment.api_url + '/api/NoteDebitCredits/detail/' + model.reference);
    var transactions = this.http.post(environment.api_url + '/api/LogTransactions/getLogForNote', model);
    return forkJoin([note, transactions]);
  }

 



}
