import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavigationService } from '../navigation.service';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private navigationService: NavigationService, private _http: HttpClient, private userService: UserService) { }

  loginSubmit(loginForm) {
    if (!loginForm.valid) {
      console.log('Invalid'); return;
    }
    this.login(JSON.stringify(loginForm.value))
      .subscribe(
        (data: { user: any}) => { this.userService.user.next(data.user); this.navigationService.navigateHome(); },
        error => console.error(error)
      )
  }

  login(body: any) {
    return this._http.post('http://127.0.0.1:3000/api/auth/login', body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }


}
