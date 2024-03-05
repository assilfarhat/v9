import { Injectable } from '@angular/core';
import { JsonHubProtocol } from '@aspnet/signalr';


class Token {
  constructor(public access_token?: string, public expiration?: Date) {

  }
}
export interface User {
  firsNtame: string;
  lastname: string;
  phonenumber: string;
  lastConnection: Date;
  email: string;
  idStation: string;
  idClient: string;
}
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: Token;
  private user: User;
  private role: any;
  private username: any;
  private organisation: any;
  private LastConexion: any;
  private access: any;
  private lang: any;
  private organisationType: any;
  expiration: string;
  private accessDec:any;
  constructor() {

    if (localStorage.getItem('token') != null) {

      const login_date = new Date(localStorage.getItem('login_date'));
      const now = new Date();
      this.token = JSON.parse(localStorage.getItem('token'));
      this.organisation = JSON.parse(localStorage.getItem('organization'));
      this.role = JSON.parse(localStorage.getItem('userRole'));
    }
  }

  setUser(infos: User) {
    localStorage.setItem('user', JSON.stringify(infos));
    this.user = infos;
    //console.log("userer",this.user)

  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));

  }
  setToken(token: Token, remember_me: boolean): any {
    if (remember_me) {
      localStorage.setItem('remembered', JSON.stringify(true));
    } else {
      localStorage.setItem('remembered', JSON.stringify(false));
    }
    localStorage.setItem('login_date', new Date().toISOString());
    localStorage.setItem('token', JSON.stringify(token));

    this.token = token;

  }

  getToken(): Token {
    return this.token;
  }

  getRole(): any {
    this.role = localStorage.getItem('role')
    return this.role;
  }
  setRole(role: any): any {

    localStorage.setItem('role', role);
    this.role = role;
  }
  setUsername(username: any): any {

    localStorage.setItem('username', username);
    this.username = username;
  }
  getUsername(): any {
    this.username = localStorage.getItem('username')
    return this.username;
  }

  getLang(): any {
    this.lang = localStorage.getItem('lang')
    return this.lang;
  }
  setLang(lang: any): any {

    localStorage.setItem('lang', lang);
    this.lang = lang;
  }


  getOrgnaisation(): any {
    this.organisation = localStorage.getItem('organisation')
    return JSON.parse(this.organisation);
  }
  setOrgnaisation(organisation: any): any {

    localStorage.setItem('organisation', JSON.stringify(organisation));
    this.organisation = organisation;
  }

  getLastConexion(): any {
    this.LastConexion = localStorage.getItem('LastConexion')
    return this.LastConexion;
  }
  setLastConexion(LastConexion: any): any {

    localStorage.setItem('LastConexion', LastConexion);
    this.LastConexion = LastConexion;
  }


  getAccess(): any {
    this.access = localStorage.getItem('access')
    
    return this.access;
  }
  
  setAccess(access: any): any {

    localStorage.setItem('access', JSON.stringify(access));
    this.access = access;
  }

  getAccessDec(): any {
    this.accessDec = localStorage.getItem('accessDec')
    
    return this.accessDec;
  }

  setAccessDec(accessDec: any): any {
    localStorage.setItem('accessDec', JSON.stringify(accessDec));
    this.accessDec = accessDec;
  }
  getOrganisationType(): any {
    this.organisationType = localStorage.getItem('organisationType')
    
return this.organisationType;
  }
  setOrganisationType(organisationType: any): any {

    this.accessDec = localStorage.getItem('accessDec')
 
    return this.accessDec;
  }
  getExpirationDate(): any {
    this.expiration = localStorage.getItem('expiration')
    return this.expiration;
  }
  setExpirationDate(expiration: any): any {

    localStorage.setItem('expiration', expiration);
    this.expiration = expiration;
  }
  clear() {
    localStorage.removeItem('remembered');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('login_date');
    localStorage.removeItem('organisation');
    localStorage.removeItem('role');
    localStorage.removeItem('access');
    localStorage.removeItem('LastConexion');
    localStorage.removeItem('organisationType');
    localStorage.removeItem('expiration');
    localStorage.removeItem('accessDec');
    
  }




}
