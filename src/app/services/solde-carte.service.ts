import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoldeCarteService {


    constructor(private http: HttpClient) { }

  RechargerCarte(model) {
    return this.http.post(environment.api_url + '/api/SoldeCartes/RechargerCarte', model);
  }
  TransfertPP(model) {
    return this.http.post(environment.api_url + '/api/SoldeCartes/TransfertPP', model);
  }
  TransfertPS(model) {
    return this.http.post(environment.api_url + '/api/SoldeCartes/TransfertPS', model);
  }
  getSoldeCartePPAndClient(CompteDomestique,clientID) {
    return this.http.get(environment.api_url + '/api/SoldeCartes/getSoldeCartePPAndClient/'+CompteDomestique+"/"+ clientID);
  }
}
