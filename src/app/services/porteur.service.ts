import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PorteurService {

  constructor(private http: HttpClient) { }
  Add(porteur) {
    return this.http.post(environment.api_url + '/api/Porteur', porteur);
  }
  update(porteur) {
    return this.http.post(environment.api_url + '/api/Porteur/update', porteur);
  }

  List(idClient) {
    return this.http.get(environment.api_url + '/api/Porteur/' + idClient);
  }
  getById(idPorteur) {
    return this.http.get(environment.api_url + '/api/Porteur/getById/' + idPorteur);
}


GetPorteurById(idPorteur) {
  return this.http.get(environment.api_url + '/api/Porteur/GetPorteurById/' + idPorteur);
}
  ConfirmeRecharge(model) {
    return this.http.post(environment.api_url + '/api/Porteur/confirmeRecharge', model);
  }
}
