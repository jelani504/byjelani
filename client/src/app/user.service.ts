import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userBag = new BehaviorSubject([]);
  public user = { 
    id: 1,
    email: 'jhankins02@gmail.com',
    shoppingBag: [],
    password: '123'
  }
  constructor(private userService: UserService) { 
    this.userBag.next(this.user.shoppingBag);
    this.userBag.subscribe(bag => console.log(bag));
  }

  getUser(){
    return this.user;
  }

  addProductToBag(product, selectedSize){
    const userBag = this.userBag.getValue();
    const isItemInBag = this.isItemInBag(product, selectedSize);
    if(isItemInBag){
      userBag[isItemInBag.index] = {product, selectedSize, quantity: isItemInBag.quantity + 1}
    } else {
      this.userBag.next(userBag.concat([{product, selectedSize, quantity: 1}]));
    }
    // send off to api to add to bag
  }

  isItemInBag(product, selectedSize){
    let isItemInBag;
    this.userBag.getValue().forEach((item, index) => {
      if(item.product.id === product.id && item.selectedSize === selectedSize){
        isItemInBag = {index, quantity: item.quantity};
      }
    })
    return isItemInBag;
  }
}
