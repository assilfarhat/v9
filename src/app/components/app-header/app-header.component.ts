import { Component, OnInit, HostListener } from '@angular/core';
import { AuthServiceService } from 'app/services/auth-service.service';
import { TokenService } from 'app/services/token.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { ReclamationService } from 'app/services/reclamation.service';
import { SignalRService } from 'app/services/signal-r.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})


export class AppHeaderComponent implements OnInit {
  timer: any;
  user: any;
  langSelected: any;
  AllReclamation:any;
  AllGerantReclamation:any;
  AllclientReclamation:any;
  showLang = false;
  constructor(private location: Location, private tokenService: TokenService, private ReclamationService : ReclamationService,
    private authService: AuthServiceService, public signalRService: SignalRService,
    private router: Router, private http: HttpClient, public translate: TranslateService) 
    {
    translate.addLangs(['en', 'fr'])
    this.langSelected = this.tokenService.getLang();


    translate.setDefaultLang(this.langSelected);
    const browserLang = translate.getBrowserLang();
    //translate.use(browserLang.match(/en|fr/) ? browserLang:'fr');
    translate.use(this.langSelected)
    if (this.langSelected == "en") {
      this.showLang = true
      this.tokenService.setLang('en')
    }
    if (this.langSelected == "fr") {
      this.showLang = false
      this.tokenService.setLang('fr')
    }

    

  }


  ngOnInit() {
   // setTimeout(() => { this.ngOnInit() }, 1000 * 10);
    this.http.get(environment.api_url + '/api/Account/Profile').subscribe(
      (resp) => {
        this.user = resp;

      }
    );

    // this.signalRService.startConnection();
    // this.signalRService.addTransferChartDataListener();   
    // this.startHttpAllRequest();
    // this.startHttpAllCerantRequest();
    // this.startHttpAllClientRequest();
  }

//signalR
  private startHttpAllRequest = () => {
    this.http.get(environment.api_url +'/api/Reclamation/GetAllFromSignalR')
      .subscribe(res => {
        this.AllReclamation = res;
       // //console.log(res);
      })
  }

  private startHttpAllCerantRequest = () => {
    this.http.get(environment.api_url +'/api/Reclamation/GetAllGerantFromSignalR')
      .subscribe(res => {
        this.AllGerantReclamation = res;
       // //console.log(res);
      })
  }

  private startHttpAllClientRequest = () => {
    this.http.get(environment.api_url +'/api/Reclamation/GetAllClientFromSignalR')
      .subscribe(res => {
        this.AllclientReclamation = res;
       // //console.log(res);
      })
  }



  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e) {

    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.logout(), environment.sessionTime * 1000 * 60 /*minuts to millisecond converssion*/);
  }

  switch() {

    this.showLang = !this.showLang
    if (this.tokenService.getLang() == 'en') {
      location.reload()
      this.tokenService.setLang('fr')


    }
    else {
      location.reload()

      this.tokenService.setLang('en')


    }

  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  

  
}
