import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-shopping-bag',
  templateUrl: './shopping-bag.component.html',
  styleUrls: ['./shopping-bag.component.scss']
})
export class ShoppingBagComponent implements OnInit {

  public displayedColumns = ['ITEM', 'PRICE', 'QUANTITY'];
  public bagSubtotal = new BehaviorSubject(0);
  public shippingEstimate = new BehaviorSubject(0);
  public orderTotal = new BehaviorSubject(0);
  public vmOrderTotal;
  constructor(private userService: UserService) {
    this.orderTotal.subscribe(orderTotal => {
      console.log(orderTotal);
      this.vmOrderTotal = {orderTotal, bagSubtotal: this.bagSubtotal.getValue(), shippingEstimate: this.shippingEstimate.getValue()}
    })
  }

  ngOnInit() {
    this.getOrderTotal();
  }

  getBagSubtotal(){
    let bagSubtotal = 0;
    this.userService.userBag.getValue().forEach(item => {
      bagSubtotal += item.product.price.usd.number * item.quantity;
    });
    this.bagSubtotal.next(bagSubtotal);
    console.log(bagSubtotal, 'bagSubtotal');
    return bagSubtotal;
  }

  getOrderTotal(){
    const orderTotal = this.getBagSubtotal() + this.shippingEstimate.getValue();
    this.orderTotal.next(orderTotal);
    return orderTotal;
  }

}
