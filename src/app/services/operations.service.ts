import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { isNull } from 'util';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  constructor(private http: HttpClient) { }
  GetOperations(input: any) {
    return this.http.post(environment.api_url + '/api/Operations/GetOperations', input);
  }

}
