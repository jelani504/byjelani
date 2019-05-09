import { Injectable, Component, Inject } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userBag = new BehaviorSubject([]);
  public bagSubtotal = new BehaviorSubject(0);
  public shippingEstimate = new BehaviorSubject(0);
  public orderTotal = new BehaviorSubject(0);

  public user = new BehaviorSubject({shoppingBag: [], email: String});
    constructor(private _http: HttpClient, public dialog: MatDialog) {
      this.getUser().subscribe((res: {user: any}) => this.user.next(res.user));
      this.user.subscribe( (user: {shoppingBag: any}) => {
        if(user){
          this.userBag.next(user.shoppingBag);
        }
      })
      this.userBag.subscribe(()=> this.getOrderTotal() )
      // this.userBag.next(this.user.getValue().shoppingBag);
      // this.userBag.subscribe( bag => this.updateUser('shoppingBag', bag).subscribe(user =>{ console.log(user)}));
    }

  getUser(){
    return this._http.get('http://127.0.0.1:3000/api/user', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  logout(){
    return this._http.get('http://127.0.0.1:3000/api/user/logout', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  openDialog(displayStr: string) {
    this.dialog.open(SignInDialog, { data : { displayStr } });
  }

  updateUser(key, value, changedValues?){
    if(changedValues){
      return this._http.post('http://127.0.0.1:3000/api/user/update', {changedValues}, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('Content-Type', 'application/json')
      });
    }
    return this._http.post('http://127.0.0.1:3000/api/user/update', {key, value}, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  addProductToBag(product, selectedSize, subBrand){
    const userBag = this.userBag.getValue();
    const isItemInBag = this.isItemInBag(product, selectedSize);
    if(isItemInBag){
      userBag[isItemInBag.index] = {product, selectedSize, quantity: isItemInBag.quantity + 1, subBrand};
      this.updateUser('shoppingBag', userBag).subscribe((res: {user: any}) => {this.user.next(res.user)});
    } else {
      const newBag = userBag.concat([{product, selectedSize, quantity: 1, subBrand}]);
      this.updateUser('shoppingBag', newBag).subscribe((res: {user: any}) => {this.user.next(res.user)});

    }
  }

  getBagSubtotal(){
    let bagSubtotal = 0;
    this.userBag.getValue().forEach(item => {
      bagSubtotal += item.product.price.usd.number * item.quantity;
    });
    this.bagSubtotal.next(bagSubtotal);
    return bagSubtotal;
  }

  getOrderTotal(){
    const orderTotal = this.getBagSubtotal() + this.shippingEstimate.getValue();
    this.orderTotal.next(orderTotal);
    return orderTotal;
  }

  isItemInBag(product, selectedSize?){
    if(!product){return;}
    let isItemInBag;
    const userBag = this.userBag.getValue()
    if(selectedSize){
      userBag.forEach((item, index) => {
        if(item.product.id === product.id && item.selectedSize === selectedSize){
          isItemInBag = {index, quantity: item.quantity};
        }
      });
    } else {
      userBag.forEach((item, index) => {
        if(item.product.id === product.id){
          isItemInBag = true;
        }
      });
    }
    return isItemInBag;
  }

  editQuantityInBag(itemID: string, selectedSize, option){
    const userBag = this.userBag.getValue();
    userBag.forEach((item, index) => {
      if(item.product.id === itemID && item.selectedSize === selectedSize){
        const itemCopy = Object.assign({}, item);
        if(option === 'incriment'){
          itemCopy.quantity++;
        } else if (option === 'decriment'){
          if(itemCopy.quantity !== 0){ itemCopy.quantity += -1;}
        }
        if(itemCopy.quantity === 0){
          userBag.splice(index, 1);
        } else {
          userBag[index] = itemCopy;
        }
        this.updateUser('shoppingBag', userBag).subscribe((res: {user: any}) => {this.user.next(res.user)});
      }
    });
  }
}

@Component({
  selector: 'sign-in-dialog',
  template: `
    <h1 style="font-family: 'Oswald' !important; font: 'Oswald' !important;" mat-dialog-title>{{data.displayStr}}</h1>
    <div style="text-align: center" mat-dialog-content>
      <button style="margin-left: 5%; margin-right: 5%; font-family: 'Oswald'" mat-button (click)="onButtonClick('sign up')">Sign Up</button>
      <button style="margin-left: 5%; margin-right: 5%; font-family: 'Oswald'" mat-button (click)="onButtonClick('login')">Login</button>
    </div>
  `
})
export class SignInDialog {
  constructor(
    public navigationService: NavigationService,
    public dialogRef: MatDialogRef<SignInDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { displayStr: string }
  ) {
    dialogRef.disableClose = true;
  }
  onButtonClick(button: string): void {
    if(button === 'sign up'){
      this.navigationService.navigateToRegister();
    }
    if(button === 'login'){
      this.navigationService.navigateToLogin();
    }
    this.dialogRef.close();
  }
}
