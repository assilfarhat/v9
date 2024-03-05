import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from 'app/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements  CanActivate  {
token:any;
  expiration: string | number | Date;
  constructor(
    private router: Router,
    private tokensService: TokenService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      let tokenService1=new TokenService();
      this.token= tokenService1.getToken(); //this.tokensService.getToken();
      this.expiration=tokenService1.getExpirationDate();

      if (this.token != null && this.token !=undefined && new Date(this.expiration)> new Date()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
  
}
