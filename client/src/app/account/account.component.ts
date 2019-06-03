import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { SnackbarService } from '../snackbar.service';

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
    currentPassword: new FormControl(null),
    firstName: new FormControl(null),
    lastName: new FormControl(null),
    newPassword: new FormControl(null),
    confirmPassword: new FormControl(null),
    acceptContact: new FormControl(null),
    gender: new FormControl(null)
  });
  constructor(
    private userService: UserService,
    private snackBarService: SnackbarService
    ) {
    userService.user.subscribe(user => {
      const { email } = user;
      if(!email){
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
    this.userService.logout().subscribe(
      (res: {success: string}) => { 
        console.log(res);
        this.snackBarService.snackBarMessage.next(res.success);
        setTimeout(()=> window.location.href = '/', 2000);
      },
      err => console.log(err));
  }

  saveChanges(){
    if(!this.vmUser._id){
      this.userService.openDialog('You must be signed in to update account information.')
      return ;
    }
    if(this.accountForm.value.confirmPassword !== this.accountForm.value.newPassword){
      this.snackBarService.snackBarMessage.next('Passwords do not match.');
      return ;
    }
    const changedValues = Object.keys(this.accountForm.value)
      .filter(key => this.accountForm.value[key] !== null)
      .map(key => {
        const newPair = {};
        newPair[key] = this.accountForm.value[key];
        return newPair;
      });
    this.userService.updateUser(null, null, changedValues)
      .subscribe(
        (res: {user: any}) => { 
          this.vmUser = res.user; this.snackBarService.snackBarMessage.next('Got you.');
        },
        (res: {error: {error: string}}) => {
          this.snackBarService.snackBarMessage.next(res.error.error);
        }
      );
  }

}
