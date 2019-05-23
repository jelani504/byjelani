import { Injectable, Component, Inject } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NavigationService } from './navigation.service';
import { PromocodeService } from './promocode.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userBag = new BehaviorSubject([]);
  public bagSubtotal = new BehaviorSubject(0);
  public shippingEstimate = new BehaviorSubject(0);
  public orderTotal = new BehaviorSubject(0);

  public user = new BehaviorSubject({shoppingBag: [], email: String});
    constructor(
      private _http: HttpClient,
      public dialog: MatDialog,
      private promocodeService: PromocodeService,
      private configService: ConfigService
    ) {
      this.getUser().subscribe((res: {user: any}) => this.user.next(res.user));
      this.user.subscribe( (user: {shoppingBag: any}) => {
        if(user){
          console.log(user.shoppingBag);
          this.userBag.next(user.shoppingBag);
        }
      });
      this.promocodeService.discount.subscribe(() => this.getOrderTotal());
      this.userBag.subscribe(()=> this.getOrderTotal() );
      // this.userBag.next(this.user.getValue().shoppingBag);
      // this.userBag.subscribe( bag => this.updateUser('shoppingBag', bag).subscribe(user =>{ console.log(user)}));
    }

  getUser(){
    return this._http.get(`${this.configService.apiOrigin}/api/user`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  logout(){
    return this._http.get(`${this.configService.apiOrigin}/api/user/logout`, {
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
      return this._http.post(`${this.configService.apiOrigin}/api/user/update`, {changedValues}, {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('Content-Type', 'application/json')
      });
    }
    return this._http.post(`${this.configService.apiOrigin}/api/user/update`, {key, value}, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  addProductToBag(version, selectedSize, productID){
    const userBag = this.userBag.getValue();
    const isItemInBag = this.isItemInBag(version, selectedSize);
    if(isItemInBag){
      userBag[isItemInBag.index] = {version, selectedSize, quantity: isItemInBag.quantity + 1, productID};
      this.updateUser('shoppingBag', userBag).subscribe((res: {user: any}) => {this.user.next(res.user)});
    } else {
      const newBag = userBag.concat([{version, selectedSize, quantity: 1, productID}]);
      this.updateUser('shoppingBag', newBag).subscribe((res: {user: any}) => {this.user.next(res.user)});

    }
  }

  getBagSubtotal(){
    let bagSubtotal = 0;
    this.userBag.getValue().forEach(item => {
      bagSubtotal += item.version.price.usd.number * item.quantity;
    });
    this.bagSubtotal.next(bagSubtotal);
    return bagSubtotal;
  }

  getOrderTotal(){
    const {discount, code} = this.promocodeService.discount.getValue();
    const bagSubtotal = this.getBagSubtotal();
    const shippingEstimate = this.shippingEstimate.getValue();
    let orderTotal, discountAmount;
    if(discount){
      discountAmount = (discount/100)*bagSubtotal;
      orderTotal = (((100-discount)/100)*bagSubtotal)+shippingEstimate;
      this.promocodeService.appliedPromo.next({discount, code, discountAmount})
    } else {
      orderTotal = bagSubtotal + shippingEstimate;
    }
    this.orderTotal.next(orderTotal);
    return orderTotal;
  }

  isItemInBag(product, selectedSize?){
    if(!product){return;}
    let isItemInBag;
    const userBag = this.userBag.getValue()
    if(selectedSize){
      userBag.forEach((item, index) => {
        console.log(item, 'ITEM');
        if(item.version.id === product.id && item.selectedSize === selectedSize){
          isItemInBag = {index, quantity: item.quantity};
        }
      });
    } else {
      userBag.forEach((item, index) => {
        if(item.version.id === product.id){
          isItemInBag = true;
        }
      });
    }
    return isItemInBag;
  }

  editQuantityInBag(itemID: string, selectedSize, option){
    const userBag = this.userBag.getValue();
    userBag.forEach((item, index) => {
      if(item.version.id === itemID && item.selectedSize === selectedSize){
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
