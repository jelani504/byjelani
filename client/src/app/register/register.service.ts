import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { NavigationService } from '../navigation.service';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  titles = ['Mr.', 'Mrs.', 'Ms.'];
  constructor(private _http: HttpClient, public navigationService: NavigationService, private userService: UserService) {}

  registerSubmit(registerForm): void {
    console.log(registerForm);
    if (!registerForm.valid || (registerForm.controls.password.value !== registerForm.controls.cpassword.value)) {
      console.log('Form Invalid'); return;
    }
    const user = Object.assign({shoppingBag: this.userService.userBag.getValue()}, registerForm.value);
    this.register(JSON.stringify(user))
      .subscribe(
        data => { console.log(data); this.navigationService.navigateToLogin()},
        error => console.error(error)
      )
    // console.log(JSON.stringify(this.registerForm.value));
  }

  register(user) {
    return this._http.post('http://127.0.0.1:3000/api/user/register', user, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
