import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userBag = new BehaviorSubject([]);
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
    this.userBag.next(this.userBag.getValue().concat([{product, selectedSize}]));
    // send off to api to add to bag
  }
}
