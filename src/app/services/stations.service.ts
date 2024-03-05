import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StationsService {

  
  constructor(private http: HttpClient) { }


  List() {
    return this.http.get(environment.api_url + '/api/stations');
  }
  ActiveStation() {
    return this.http.get(environment.api_url + '/api/stations/active');
  }
  getAllStation
  () {
    return this.http.get(environment.api_url + '/api/stations/AllStations');
  }
  
  Get(id: any) {
    return this.http.get(environment.api_url + '/api/stations/'+id);
  }

  Add(stations) {
    return this.http.post(environment.api_url + '/api/stations', stations);
  }
  Edit(stations) {
    return this.http.put(environment.api_url + '/api/stations/' + stations.idstations, stations);
  }
  ConfirmeRecharge(model) {
    return this.http.post(environment.api_url + '/api/stations/confirmeRecharge', model);
  }
  GetlistFamillestations() {
    return this.http.get(environment.api_url + '/api/stations/familles');
  }

  GetStationsIdName() {
    return this.http.get(environment.api_url + '/api/stations/GetStationsIdName');
  }
  

}
