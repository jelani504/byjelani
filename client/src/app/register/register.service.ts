import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { NavigationService } from '../navigation.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  titles = ['Mr.', 'Mrs.', 'Ms.'];
  constructor(private _http: HttpClient, public navigationService: NavigationService) {}

 

  registerSubmit(registerForm): void {
    console.log(registerForm);
    if (!registerForm.valid || (registerForm.controls.password.value !== registerForm.controls.cpassword.value)) {
      console.log('Form Invalid'); return;
    }
    this.register(JSON.stringify(registerForm.value))
      .subscribe(
        data => { console.log(data); this.navigationService.navigateToLogin()},
        error => console.error(error)
      )
    // console.log(JSON.stringify(this.registerForm.value));
  }

  register(user) {
    return this._http.post('http://127.0.0.1:3000/api/users/register', user, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
