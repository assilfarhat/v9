import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZoneGeographiqueService {

  constructor(private http: HttpClient) { }


  get() {
    return this.http.get(environment.api_url + '/api/ZoneGeographiques' );
  }

}
