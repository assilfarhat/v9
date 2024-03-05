import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  getListRoles() {
    return this.http.get(environment.api_url + '/api/Account/Roles');
  }

  getListOrgansitaion() {
    return this.http.get(environment.api_url + '/api/Organizations');
  }

  addUser(user: any): any {
    return this.http.post(environment.api_url + '/api/Account/Register', user);
  }

  // getAllUsers(id: any) {
  //   return this.http.get(environment.api_url + '/api/Account/Users/' + id);
  // }
  getAllUsers(id: any, idClient: string | null = null) {
   
    let url = `${environment.api_url}/api/Account/Users/${id}`;
    if (idClient !== null) {
      url += `/${idClient}`;
    }
    return this.http.get(url);
  }

  deleteUser(id: any) {
    return this.http.post(environment.api_url + '/api/Account/delete/' + id, null);
  }

  getSuperviseur() {
    return this.http.get(environment.api_url + '/api/Account/Superviseur');
  }

  getUserByRole(id:any){
    return this.http.get(environment.api_url + '/api/Account/GetUserByRole/'+id);
    
  }
  updateUser() {

  }

  activateUser(id: any) {

    return this.http.post(environment.api_url + '/api/Account/Lockout?id=' + id, null);
  }

  getPermissions(id: any) {
    return this.http.get(environment.api_url + '/api/UserAccesses/' + id);
  }

  changePermissions(userid: any, permissions) {

    return this.http.post(environment.api_url + '/api/UserAccesses/' + userid, permissions);

  }
  recoverPassword(usernameOrMail: string) {
    const params = new URLSearchParams();
    params.set('userName', usernameOrMail)
    return this.http.post(environment.api_url + '/api/Account/RecoverPassword?' + params.toString(), null);
  }


  changePassword(params: any) {
    return this.http.post(environment.api_url + '/api/Account/ChangePassword', params);
  }

  updateProfile(user: any) {
    return this.http.post(environment.api_url + '/api/Account/UpdateProfile', user)
  }

  update(id: any, user: any) {
    return this.http.post(environment.api_url + '/api/Account/UpdateUser/' + id, user)
  }
}
