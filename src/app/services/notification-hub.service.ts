import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationHubService {
  private notificationUrl = environment.api_url+"/notification";
  private connection: signalR.HubConnection;
  connectionEstablished = new Subject<Boolean>();
  notifications = new Subject<Notification[]>();
  constructor(private AuthServiceService : AuthServiceService) { }

  connect() {
    if (!this.connection) {
      
      this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.notificationUrl,{
        accessTokenFactory: () => (this.AuthServiceService.currentUserValue).token
      })
      .build();

      this.connection.start().then(() => {
        //console.log('Hub connection started')
        this.connectionEstablished.next(true);
      }).catch(err => console.log(err));


      this.connection.on('GetNotifications', (notifications) => {
        //console.log('Received', notifications);
        this.notifications.next(notifications);
      });
     }
  }


  disconnect() {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }
}
