import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserbagService {
  private userBag = new BehaviorSubject([]);
  constructor() {
    this.userBag.subscribe(bag => console.log(bag))
   }

  addProductToBag(product, selectedSize){
    this.userBag.next(this.userBag.getValue().concat([{product, selectedSize}]));
  }
}
