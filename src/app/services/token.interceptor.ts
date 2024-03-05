import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { TokenService } from './token.service';
import { Router } from '@angular/router';


/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private token;
  private expiration;
  constructor(private tokensService: TokenService, private router: Router) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const uri = req.url.replace(environment.api_url, '');
    this.token = this.tokensService.getToken();
    this.expiration = this.tokensService.getExpirationDate();
    if (new Date(this.expiration) < new Date() && this.expiration != null) {
      this.tokensService.clear();
      this.router.navigate(['/login']);
    }

    if (uri.startsWith('/api') && req.method !== 'OPTIONS' && this.token != null) {


      const request = req.clone({
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.token.access_token
        })


      });

      return next.handle(request);
    }
    return next.handle(req);
  }
}
