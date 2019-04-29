import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  public snackBarMessage = new BehaviorSubject(null);
  constructor() { }
}
