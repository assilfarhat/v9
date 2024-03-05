import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  AllReclamation:any;
private hubConnection: signalR.HubConnection
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder().configureLogging(signalR.LogLevel.None)
      .withUrl(environment.api_url +'/Reclamation')
                            .build();
    this.hubConnection
      .start()
      ////console.log('Connection started'))
      .catch(err => err)////console.log('Error while starting connection: ' + err))
  }
  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferdata', (data) => {
     return data;
      ////console.log(data);
    });
  }
}
