import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
class DataTablesResponse {
  data: any[];
  draw: number;
  infos:any
}
@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  constructor(private http: HttpClient) { }


  getAllReclamations(model:any)
  {
    
    return this.http.post<DataTablesResponse>(environment.api_url + '/api/Reclamation/Suivi',model);
    
  }
  update(id:any,user:any){
    return this.http.post(environment.api_url+'/api/Reclamation/UpdateReclamation/'+id,user)
  }

  addReclamation(reclamation: any): any {
    return this.http.post(environment.api_url + '/api/ReclamationClient/AddReclamation' , reclamation);
  }
}
