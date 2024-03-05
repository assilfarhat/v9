import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'app/services/auth-service.service';
import { TokenService } from 'app/services/token.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  hasError = false;
  errorMessage: string;
  langSelected:any;
  showLang=false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService:AuthServiceService,
    private tokensService:TokenService, public translate:TranslateService
     ) {
      translate.addLangs(['en','fr'])
      this.langSelected=this.tokensService.getLang();
      if(this.langSelected==''||this.langSelected==null){
        this.langSelected='fr';
      }
      if(this.langSelected!="fr"){
        this.showLang=true
      }
      translate.setDefaultLang(this.langSelected);
      const browserLang = translate.getBrowserLang();
     // translate.use(browserLang.match(/en|fr/) ? browserLang:'fr');
     translate.use(this.langSelected)

      }

     ngOnInit() {
      this.form = this.fb.group({
        userName : [ '', [ Validators.required ]] ,
        password : [ '', [Validators.required, Validators.minLength(7)]],
        //password : [ '', [Validators.required, Validators.minLength(7), Validators.pattern(/^(?=\D*\d)(?=.*[$@$!%*?+&])(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{7,30}$/)]],
        
        remember_me:['']
      })
    }

    switch(){

      this.showLang=!this.showLang

    }
  Login() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
        return;
        }
    this.authService.authenticate(this.form.value).subscribe(
      (res) => {

        this.tokensService.setToken({ access_token: res['token'], expiration: res['expiration']},this.form.get('remember_me').value);
        this.tokensService.setOrgnaisation(res['organization'] );
        this.tokensService.setRole(res['userRole'] );
        this.tokensService.setLastConexion(res['lastConnection'] );
        this.tokensService.setAccess(res['access']);
        this.tokensService.setOrganisationType(res.organisationType);
        this.tokensService.setExpirationDate(res.expiration);
        this.tokensService.setAccessDec(res.accessDec);

        if(this.showLang==false){this.tokensService.setLang('fr')}
        if(this.showLang==true){this.tokensService.setLang('en')}


        this.authService.getUserInfos().subscribe(
          (infos: any) => {
            this.tokensService.setUser(infos);
            this.router.navigate(['/home']);
          }
        );
          } ,(err) =>{
            this.hasError = true;
            this.errorMessage = err.error.message;
            if(err.error.message==undefined){
              this.errorMessage="Impossible de se connecter au serveur"
            }
            if(this.showLang!=false){
              if(this.errorMessage=="Le nom d'utilisateur ou le mot de passe est incorrect"){
                this.errorMessage="The username or password is not right!";

              }
              if (this.errorMessage=="Compte désactivé"){
                this.errorMessage="Account Disabled";

              }
              if(err.error.message==undefined){
                this.errorMessage="Impossible to connect to the server"
              }
            }
          }
    );
  }
  get f() { return this.form.controls; }
  get rememberme() { return this.form.get('remember_me'); }

}
