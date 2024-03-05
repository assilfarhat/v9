import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TpeService {

  constructor(private http: HttpClient) { }


  getTpe(){
    
    return this.http.get(environment.api_url + '/api/Tpes' );
  }

  geTpeDisponibleByStation(idStation){
    
    return this.http.get(environment.api_url + '/api/Tpes/geTpeDisponibleByStation/' +idStation);
  }

  getTpeBySerial(id){
    
    return this.http.get(environment.api_url + '/api/Tpes/' +id);
  }
  addTpe(tpe:any){
    return this.http.post(environment.api_url + '/api/Tpes',tpe);
    
  }

  updateTpe(id:any,tpe:any){
    return this.http.post(environment.api_url + '/api/Tpes/'+id,tpe);
    
  }
  deleteTpe(id:any){
    return this.http.post(environment.api_url + '/api/Tpes/DeleteGwTpe/'+id , null);

    
  }

  

}
