import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userBag = new BehaviorSubject([]);
  public bagSubtotal = new BehaviorSubject(0);
  public shippingEstimate = new BehaviorSubject(0);
  public orderTotal = new BehaviorSubject(0);

  public user = new Subject();
    constructor(private _http: HttpClient) {
      this.getUser().subscribe((res: {user: any}) => this.user.next(res.user));
      this.user.subscribe( (user: {shoppingBag: any}) => {this.userBag.next(user.shoppingBag)})
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

  updateUser(key, value){
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
