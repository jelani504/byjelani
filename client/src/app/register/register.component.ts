import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    cpassword: new FormControl(null, [Validators.required]),
    acceptContact: new FormControl(true),
    title: new FormControl(null, [Validators.required]),
    proccessPersonalData: new FormControl(null, [Validators.required])
  });

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  constructor(private router: Router, public registerService: RegisterService) {
    console.log(registerService);
   }

  ngOnInit() {
  }

  register(): void {
    if (!this.registerForm.valid || (this.registerForm.controls.password.value !== this.registerForm.controls.cpassword.value)) {
    console.log('Form Invalid');
    return;
    }
    console.log(this.registerForm);
    this.submitEM.emit(this.registerForm.value);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

}
