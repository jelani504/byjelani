import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  checked = false;

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl(''),
    cpassword: new FormControl(''),
    acceptEmails: new FormControl(false)
  });

  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  submit(): void {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }

}
