import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavigationService } from '../navigation.service';
import { UserService } from '../user.service';
import { SnackbarService } from '../snackbar.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private navigationService: NavigationService,
    private _http: HttpClient,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private configService: ConfigService
  ){ }

  loginSubmit(loginForm) {
    if (!loginForm.valid) {
      console.log('Invalid'); return;
    }
    this.login(JSON.stringify(loginForm.value))
      .subscribe(
        (data: { user: any}) => { this.userService.user.next(data.user); this.navigationService.navigateHome(); },
        error => {console.error(error); this.snackbarService.snackBarMessage.next(`Login Invalid: ${error.error.message}`)}
      )
  }

  loginWithFacebook(){
    this._http.get(this.configService.vmFacebookLink, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).subscribe(
      user=>{console.log(user, 'LOGIN WITH FACEBOOK USER'); },
      err =>{console.log(err, 'LOGIN WITH FACEBOOK ERROR'); }
      );

  }

  login(body: any) {
    return this._http.post(`${this.configService.apiOrigin}/api/auth/login`, body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }


}
