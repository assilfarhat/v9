import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GroupeService {
    
  
  constructor(private http: HttpClient) { }

  add(model:any) {
    return this.http.post(environment.api_url + '/api/Add/Groupe',model)
  }

  update(id,model){
    return this.http.put(environment.api_url + '/api/Update/Groupe/'+ `${id}`, model);
  }
}
