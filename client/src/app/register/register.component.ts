import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    mr: new FormControl(null, [Validators.required]),
    miss: new FormControl(null, [Validators.required]),
    proccessPersonalData: new FormControl(null, [Validators.required])
  });

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  register(): void {
    if (!this.registerForm.valid || (this.registerForm.controls.password.value !== this.registerForm.controls.cpassword.value)) {
    console.log('Form Invalid');
    return;
    }
    this.submitEM.emit(this.registerForm.value);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

}
