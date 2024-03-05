import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CarteService {
  constructor(private http: HttpClient) { }
  public CateEtStation(id): Observable<any[]> {


    var carte = this.http.get(environment.api_url + '/api/Cartes/byNumCarte/' + id);
    var station = this.http.get(environment.api_url + '/api/stations');
    var zoneGeographique = this.http.get(environment.api_url + '/api/ZoneGeographiques');
    return forkJoin([carte, station, zoneGeographique]);
  }
  changerPlafondTemporaire(model) {
    return this.http.post(environment.api_url + '/api/Cartes/changerPlafondTemporaire', model);
  }

  List(model) {
    return this.http.post(environment.api_url + '/api/Cartes/filtreCarte', model);
  }

  getBonRecharge(idClient) {
    return this.http.get(environment.api_url + '/api/SoldeCartes/getBonRecharge/' + idClient);
  }

  GetActivePPCarteByClient(idClient, numCarte) {
    return this.http.get(environment.api_url + '/api/Cartes/GetActivePPCarteByClient/' + idClient + "/" + numCarte);
  }
  GetCartePPByClientWithSolde(clientId) {
    return this.http.get(environment.api_url + '/api/Cartes/GetCartePPByClientWithSolde/' + clientId);
  }

  getbyIdPorteur(id: any) {
    return this.http.get(environment.api_url + '/api/Cartes/getbyIdPorteur/' + id);
  }
  ReplaceCarte(id: any) {
    return this.http.post(environment.api_url + '/api/Cartes/Replace/' + id, null);
  }
  MiseEnOppostion(id: any) {
    return this.http.post(environment.api_url + '/api/Cartes/MiseEnOppostion/' + id, null);
  }
  RenouvlerCarte(id: any) {
    return this.http.post(environment.api_url + '/api/Cartes/Renouvellment/' + id, null);
  }
  activer(id: any) {
    return this.http.get(environment.api_url + '/api/Cartes/Activer/' + id);
  }
  dmdActiver(id: any) {
    return this.http.post(environment.api_url + '/api/Cartes/DmdActiver/'+ id, null);
  }
  BloquerDebloquer(model) {
    return this.http.post(environment.api_url + '/api/Cartes/BloquerDebloquer', model);
  }
  BloquerActiver(id) {
    return this.http.get(environment.api_url + '/api/Cartes/BloquerDebloquer/' + id);
  }
  Add(client) {
    return this.http.post(environment.api_url + '/api/Cartes', client);
  }
  CarteSettings(client) {
    return this.http.post(environment.api_url + '/api/Cartes/CarteSettings', client);
  }
  AddCartEnMass(model) {
    return this.http.post(environment.api_url + '/api/Cartes/AddCartEnMass', model);
  }
  RepartitionPlafondPS(model) {
    return this.http.post(environment.api_url + '/api/Cartes/RepartitionPlafondPS', model);
  }
  rechargerEnMassCarte(model) {
    return this.http.post(environment.api_url + '/api/SoldeCartes/rechargerEnMassCarte', model);
  }


  Edit(client) {
    return this.http.put(environment.api_url + '/api/client/' + client.idClient, client);
  }
  ConfirmeRecharge(model) {
    return this.http.post(environment.api_url + '/api/client/confirmeRecharge', model);
  }
  GetRechargeClient() {
    return this.http.get(environment.api_url + '/api/RechargeClient');
  }
  getProduitsByCarte(id: any) {
    return this.http.get(environment.api_url + '/api/Cartes/getProduitbyIdCarte/' + id);
  }
  byNumCarte(id: any) {
    return this.http.get(environment.api_url + '/api/Cartes/byNumCarte/' + id);
  }
  getcarteDetailsById(id: any) {
    return this.http.get(environment.api_url + '/api/Cartes/Details/' + id);
  }

  AffectationsProduit(produitCarte) {
    return this.http.post(environment.api_url + '/api/Cartes/AffectationsProduit', produitCarte);
  }
  GetOperationsTransfertRecharge(input: any) {
    return this.http.post(environment.api_url + '/api/SoldeCartes/HistoriqueRechargeAndTransfert', input);
  }
  public GetActiveCarteByClient(idClient, numCarte): Observable<any[]> {
    var cartePP = this.http.get(environment.api_url + '/api/Cartes/GetActivePPCarteByClient/' + idClient + "/" + numCarte);
    var CartePS = this.http.get(environment.api_url + '/api/Cartes/GetActivePSCarteByClient/' + idClient + "/" + numCarte);
    return forkJoin([cartePP, CartePS]);
  }
  GetTarif() {
    return this.http.get(environment.api_url + '/api/Cartes/GetTarif');
  }

  GetAllActivePSCarteByClient(idClient) {
    return this.http.get(environment.api_url + '/api/Cartes/GetAllActivePSCarteByClient/' + idClient);
  }

  // service pour la recuperation des données "fiche de suivi CP"
  public detail(idClient,SelectedDate , numCarte) {
    return this.http.get(environment.api_url + '/api/Cartes/getListeCarteSuivi/' + idClient + '/' + SelectedDate + '/' + numCarte);
  }
}
