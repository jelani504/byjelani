import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public vmGenders = ['Male', 'Female'];
  public accountForm: FormGroup = new FormGroup({
    email: new FormControl(null, Validators.email),
    oldPassword: new FormControl(null),
    firstName: new FormControl(null),
    lastName: new FormControl(null),
    newPassword: new FormControl(null),
    confirmPassword: new FormControl(null),
    newsletters: new FormControl(null),
    gender: new FormControl(null)
  });
  constructor() { }

  ngOnInit() {
  }

  logout(){
    console.log('logout');
  }
  saveChanges(){
    console.log(this.accountForm);
    console.log('Save Changes');
  }

}
