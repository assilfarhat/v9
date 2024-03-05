import { Component, OnInit } from '@angular/core';
import { TokenService } from 'app/services/token.service';
import { AuthServiceService } from 'app/services/auth-service.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  
})
export class HomeComponent implements OnInit {

  user: any;
  lastconnection : any;
  constructor(private tokenService : TokenService,
    private authService:AuthServiceService,
    private router: Router,private http: HttpClient) { }

  ngOnInit() {
   this.getUserInfos();
    this.lastconnection=this.tokenService.getLastConexion();
  }

  getUserInfos() {
    this.http.get(environment.api_url + '/api/Account/Profile'  ).subscribe(
      (resp )=>{this.user=resp;

      }
    );
  } 
}