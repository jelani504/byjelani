import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { RegisterService } from './register.service';
import { NavigationService } from '../navigation.service';
import { ConfigService } from '../config.service';
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
    title: new FormControl(null, [Validators.required]),
    proccessPersonalData: new FormControl(null, [Validators.required])
  });

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  constructor(
    public registerService: RegisterService,
    public navigationService: NavigationService,
    public configService: ConfigService,
    private router: Router,
    ) {}

  ngOnInit() {
  }
}
