import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public vmGenders = ['Male', 'Female'];
  public vmUser;
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
  constructor(private userService: UserService) {
    userService.user.subscribe(user => {
      if(!user){
        this.userService.openDialog('You must be signed in to update account information.')
        return;
      }
      this.vmUser = user;
    })
  }

  ngOnInit() {
  }

  logout(){
    console.log('logout');
  }

  saveChanges(){
    if(!this.vmUser._id){
      this.userService.openDialog('You must be signed in to update account information.')
      return ;
    }
    console.log(this.vmUser);
    console.log(this.accountForm);
    console.log('Save Changes');
  }

}
