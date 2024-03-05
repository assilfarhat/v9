import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, identity, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  GetClientsIdName() {
    return this.http.get(environment.api_url + '/api/Client/GetClientsIdName');
  }

  

  GetActiveClients() {
    return this.http.get(environment.api_url + '/api/Client/GetActiveClients');
  }
  GetListePorteur() {
    return this.http.get(environment.api_url + '/api/Client/GetListePorteur');
  }

  List() {
    return this.http.get(environment.api_url + '/api/Client');
  }

  GetListClientById(model) {
    return this.http.post(environment.api_url + '/api/Client/GetClientsById', model);
  }

  Get(id: any) {
    return this.http.get(environment.api_url + '/api/Client/' + id);
  }

  Add(client) {
    return this.http.post(environment.api_url + '/api/Client', client);
  }
  Edit(client) {
    return this.http.post(environment.api_url + '/api/client/update/' + client.idClient, client);
  }

  Activer(idClient) {
    return this.http.get(environment.api_url + '/api/client/ActiverCarte/' + idClient);
  }

  getRechergeNonConfirmerByClientId(idClient, idRecharge) {
    return this.http.get(environment.api_url + '/api/RechargeClient/getRechergeNonConfirmerByClientId/' + idClient + "/" + idRecharge);
  }

  BloquerClient(idClient) {
    return this.http.get(environment.api_url + '/api/client/BloquerClient/' + idClient);
  }
  
  DemandeRecharge(model) {
    return this.http.post(environment.api_url + '/api/RechargeClient/demandeRecharge', model);
  }

  DemandeSoldeDepart(model) {
    return this.http.post(environment.api_url + '/api/RechargeClient/DemandeSoldeDepart', model);
  }


  demandePaiement(model) {
    return this.http.post(environment.api_url + '/api/RechargeClient/demandePaiement', model);
  }

  BloquerDebloquer(model) {
    return this.http.post(environment.api_url + '/api/client/BloquerDebloquer', model);
  }

  ConfirmerRecharge(model) {
    return this.http.post(environment.api_url + '/api/RechargeClient/ConfirmerRecharge', model);
  }

  confirmerPaiement(model) {
    return this.http.post(environment.api_url + '/api/RechargeClient/confirmerPaiement', model);
  }
  
  AnnulerRecharge(model) {
    return this.http.post(environment.api_url + '/api/RechargeClient/AnnulerRecharge', model);
  }
  AnnulerRechargeClient(model) {
    return this.http.post(environment.api_url + '/api/RechargeClient/AnnulerRechargeClient', model);
  }
  uploadFile(formData: FormData) {
    return this.http.post(environment.api_url + '/api/RechargeClient/Upload', formData, { reportProgress: true, observe: 'events' });
  }

  uploadBon(formData: FormData) {
    return this.http.post(environment.api_url + '/api/RechargeClient/UploadBon', formData, { reportProgress: true, observe: 'events' });
  }
  
  // GetRechargeClient(model) {
  //   return this.http.post(environment.api_url + '/api/RechargeClient', model);
  // }

  GetRechargeClient(model) {
    return this.http.post(environment.api_url + '/api/RechargeClient', model);
  }

  ConfirmeRecharge(model) {
    return this.http.post(environment.api_url + '/api/RechargeClient/confirmerRecharge', model);
  }

  GetClientWithSoldee(idClient) {
    return this.http.get(environment.api_url + '/api/Client/GetClientWithSolde/' + idClient);
  }
  
  GetRechargeData(id: string) {
    return this.http.post(environment.api_url + '/api/RechargeClient/GetRechargeData/' + id, null);
  }

  GetOperationsTransfertRecharge(input: any) {
    return this.http.post(environment.api_url + '/api/SoldeCartes/HistoriqueRechargeAndTransfert', input);
  }

  getClientDetails(idClient) {
    return this.http.get(environment.api_url + '/api/Client/getClientDetails/' + idClient);
  }

  public download(fileUrl: string) {
    return this.http.get(`${environment.api_url}/api/RechargeClient/Download?fileName=${fileUrl}`, {
      reportProgress: true,
      responseType: 'blob',
    });
  }

  getAllBanks() {
    return this.http.get(environment.api_url + '/api/GwBanks/All');
  }

  listReglement(id) {
    return this.http.get(environment.api_url + '/api/Reglement/GetDemanderReglement/' + id);
  }

  public getClientCarteWithSolde(idClient): Observable<any[]> {
    var Clients = this.http.get(environment.api_url + '/api/Client/GetClientWithSolde/' + idClient);
    var cartes = this.http.get(environment.api_url + '/api/Cartes/GetCartePPByClientWithSolde/' + idClient);
    return forkJoin([Clients, cartes]);
  }

  public getClientCarteWithSoldeForDepart(idClient): Observable<any[]> {
    var Clients = this.http.get(environment.api_url + '/api/Client/GetClientWithSoldeForDepart/' + idClient);
    var cartes = this.http.get(environment.api_url + '/api/Cartes/GetCartePPByClientWithSoldeForDepart/' + idClient);
    return forkJoin([Clients, cartes]);
  }
}
