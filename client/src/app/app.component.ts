import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SnackbarService } from './snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private snackBar: MatSnackBar,
    private snackbarService: SnackbarService
  ){
    snackbarService.snackBarMessage.subscribe( message => {
      if(message){
        snackBar.open(message, '', {
          duration: 5000, verticalPosition: "top"
        });
      }
    });
  }
  title = 'client';
}
