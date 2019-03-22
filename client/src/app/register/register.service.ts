import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  titles = ['Mr.', 'Mrs.', 'Ms.'];
  constructor(private router: Router, ) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  register(registerForm, submitEM): void {
    console.log(registerForm, submitEM);
    if (!registerForm.valid || (registerForm.controls.password.value !== registerForm.controls.cpassword.value)) {
      console.log('Form Invalid');
      return;
    }
    submitEM.emit(registerForm.value);
  }
}
