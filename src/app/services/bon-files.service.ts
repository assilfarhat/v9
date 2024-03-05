import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BonFilesService {

  constructor(private http: HttpClient) { }

  get (model) {
    return this.http.post(environment.api_url + '/api/BonDatas', model);
  }

  getFileEtat(model){
    return this.http.post(environment.api_url + '/api/BonDatas/GetFileEtat', model);
  }
}
