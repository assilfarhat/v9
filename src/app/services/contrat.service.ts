import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContratService {

  constructor(private http: HttpClient) { }

  add(model:any) {
    return this.http.post(environment.api_url + '/api/Contrat',model);
  }

  getAll() {
    return this.http.get(environment.api_url + '/api/Contrat')
    // .pipe(
    //   map( (data: any) => data.listOfOrgan)
    // );
  }
  get(id) {
    return this.http.get(environment.api_url + '/api/Get/Contrat/'+`${id}`)
    // .pipe(
    //   map( (data: any) => data.listOfOrgan)
    // );
  }
 
  update(id,model){
    return this.http.put(environment.api_url + '/api/Update/Contrat/'+ `${id}`, model);
  }
  getContratClient(id:any){
    return this.http.get(environment.api_url + '/api/Client/Contrat/'+ `${id}`);
  }
}