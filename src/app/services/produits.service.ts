import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProduitsService {


  constructor(private http: HttpClient) { }
  
  List() {
    return this.http.post(environment.api_url + '/api/Produits/filter',null);
  }
  ListCarburant() {
    return this.http.get(environment.api_url + '/api/Produits/Carburant');
  }
  ListByType() {
    return this.http.get(environment.api_url + '/api/Produits/GetProduitsGroupedByFamillle');
  }



  ListProduit() {
    return this.http.get(environment.api_url + '/api/Produits');
  }

  Get(id: any) {
    return this.http.get(environment.api_url + '/api/Produits/'+id);
  }

  Add(Produits) {
    return this.http.post(environment.api_url + '/api/Produits', Produits);
  }

  Edit(Produits) {
    return this.http.put(environment.api_url + '/api/Produits/' + Produits.idProduits, Produits);
  }
  ConfirmeRecharge(model) {
    return this.http.post(environment.api_url + '/api/Produits/confirmeRecharge', model);
  }
  GetlistFamilleProduits() {
    return this.http.get(environment.api_url + '/api/Produits/familles');
  }

}


