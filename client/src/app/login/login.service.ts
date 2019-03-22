import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private router: Router) { }

  login(loginForm, submitEM) {
    console.log(loginForm, submitEM);
    if (loginForm.valid) {
      submitEM.emit(loginForm.value);
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
