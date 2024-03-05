import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemandePersService {

  constructor(private http: HttpClient) { }


  getCarteByDemande(id) {
    return this.http.get(environment.api_url + '/api/DemandePers/getCarteByDemande/'+ id);
  }

  List() {
    return this.http.get(environment.api_url + '/api/DemandePers');
  }

  ListWithFilter(model) {
    return this.http.post(environment.api_url + '/api/DemandePers/GetDemandesWithFilter',model);
  }

  ConfrimerDemande(id) {
    return this.http.get(environment.api_url + '/api/DemandePers/ConfrimerDemande/'+ id);
  }

  AnnulerDemande(id){
    return this.http.get(environment.api_url + '/api/DemandePers/AnnulerDemande/'+id);
  }

  // service pour la recuperation des données "fiche de suivi CP Demande Perso"
  public detail(idClient,DateDebut) {
    return this.http.get(environment.api_url + '/api/DemandePers/getFicheSuiviDemdPerso/' + idClient+ '/' + DateDebut);
  }
}
