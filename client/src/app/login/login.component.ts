import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
