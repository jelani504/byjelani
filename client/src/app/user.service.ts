import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userBag = new BehaviorSubject([]);
  public bagSubtotal = new BehaviorSubject(0);
  public shippingEstimate = new BehaviorSubject(0);
  public orderTotal = new BehaviorSubject(0);

  public user = { 
    id: 1,
    email: 'jhankins02@gmail.com',
    shoppingBag: [],
    password: '123'
  }
  constructor() { 
    this.userBag.next(this.user.shoppingBag);
    this.userBag.subscribe(bag => console.log(bag));
  }

  getUser(){
    return this.user;
  }

  addProductToBag(product, selectedSize, subBrand){
    const userBag = this.userBag.getValue();
    const isItemInBag = this.isItemInBag(product, selectedSize);
    if(isItemInBag){
      userBag[isItemInBag.index] = {product, selectedSize, quantity: isItemInBag.quantity + 1, subBrand}
    } else {
      this.userBag.next(userBag.concat([{product, selectedSize, quantity: 1, subBrand}]));
    }
    // send off to api to add to bag
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
        this.userBag.next(userBag);
      }
    });
  }
}
