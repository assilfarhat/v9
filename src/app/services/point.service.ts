import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PointService {

  constructor(private http: HttpClient) { }

  add(model:any) {
    return this.http.post(environment.api_url + '/api/PointDeVente',model);
  }

  declare(model:any) {
    return this.http.post(environment.api_url + '/api/Declare/PointDeVente',model);
  }

 

  getAll() {
    return this.http.get(environment.api_url + '/api/Get/PointDeVente');
  }

  getAllDecl() {
    return this.http.get(environment.api_url + '/api/Get/Decl/PointDeVente');
  }

  getPoint(id:any){
    return this.http.get(environment.api_url + '/api/Get/PointVente/'+`${id}`)
  }
  
  update(id,model){
    return this.http.put(environment.api_url + '/api/Update/PtVente/'+ `${id}`, model);
  }

  getMCC(){
    return this.http.get(environment.api_url + '/api/Get/activity')
  }

  Activate(id){
    return this.http.put(environment.api_url + '/api/Activate/pv/'+ `${id}`,null);
  }

  
  //MAJ PtVente au niveau SPL
  updateSpl(model){
    return this.http.put(environment.api_url + '/api/Update/PtVenteSpl', model);
  }
  //Retourner les points de ventes non encore maj au niveau SPL
  getAllSplNotUpdated() {
    return this.http.get(environment.api_url + '/api/Get/PointDeVenteSpl');
  }
  
}
