import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { RegisterService } from './register.service';
import { NavigationService } from '../navigation.service';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public vmFacebookLink = `${this.configService.apiOrigin}/api/auth/login/facebook`

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

  constructor(public registerService: RegisterService, public navigationService: NavigationService, private configService: ConfigService) {}

  ngOnInit() {
  }

}
