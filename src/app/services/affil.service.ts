import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AffilService {


  constructor(private http: HttpClient) { }

  add(model:any) {
    return this.http.post(environment.api_url + '/api/Affilie',model);
  }

  getAll() {
    return this.http.get(environment.api_url + '/api/Get/Affilie');
  }

  getAffil(id){
    return this.http.get(environment.api_url + '/api/Get/Affilie/'+`${id}`)
  }
  update(id,model){
    return this.http.put(environment.api_url + '/api/Update/Affilie/'+ `${id}`, model);
  }

  addService(model:any) {
    
    return this.http.post(environment.api_url + '/api/Add/Service/Affilie',model)
    
  }

  Activate(id){
    return this.http.put(environment.api_url + '/api/Activate/Affilie/'+ `${id}`,null);
  }
}
