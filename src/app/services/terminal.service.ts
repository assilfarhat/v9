import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  constructor(private http: HttpClient) { }

  add(model:any) {
    return this.http.post(environment.api_url + '/api/Terminals',model);
  }

  declare(model:any) {
    return this.http.post(environment.api_url + '/api/Terminals/Declare',model);
  }

  getAll() {
    return this.http.get(environment.api_url + '/api/Terminals/All')
    // .pipe(
    //   map( (data: any) => data.listOfOrgan)
    // );
  }
  get(id) {
    return this.http.get(environment.api_url + '/api/Terminals/'+`${id}`)
 
  }
 
  
  update(id,model){
    return this.http.post(environment.api_url + '/api/Terminals/Update/'+ `${id}`, model);
  }

   
 
  Activate(id){
    //console.log(environment.api_url + 'api/Terminals/ActivateDesactivate/'+ id)
    return this.http.get(environment.api_url + '/api/Terminals/ActivateDesactivate/'+ id);
  }
  
 
}
