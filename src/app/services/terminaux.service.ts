import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TerminauxService {

  constructor(private http: HttpClient) { }

  getTerminaux(){
    
    return this.http.get(environment.api_url + '/api/Terminals/GetTerminalAll' );
  }

  addTerminal(terminal:any){
    return this.http.post(environment.api_url + '/api/GwTerminalMerchants/PostGwTerminalMerchant',terminal);
    
  }
  ConfirmaddTerminal(terminal:any){
    return this.http.post(environment.api_url + '/api/GwTerminalMerchants/confirm',terminal);
    
  }

  updateTerminal(id:any,terminal:any){
    return this.http.post(environment.api_url + '/api/GwTerminalMerchants/'+id,terminal);
    
  }

  deleteTerminal(id:any){
    return this.http.post(environment.api_url + '/api/GwTerminalMerchants/DeleteGwTerminalMerchant/'+id , null);
    
  }

  GetService(){
    return this.http.get(environment.api_url + '/api/GwTerminalMerchants/AllGwService');
    
  }
}
