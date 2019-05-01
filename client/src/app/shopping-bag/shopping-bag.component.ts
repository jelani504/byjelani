import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-bag',
  templateUrl: './shopping-bag.component.html',
  styleUrls: ['./shopping-bag.component.scss']
})
export class ShoppingBagComponent implements OnInit {

  public userBag: any[] = [];
  public displayedColumns: String[] = ['ITEM', 'PRICE', 'QUANTITY'];
  public bagSubtotal = new BehaviorSubject(0);
  public shippingEstimate = new BehaviorSubject(0);
  public orderTotal = new BehaviorSubject(0);
  public vmOrderTotal;
  constructor(private userService: UserService ,private router: Router) {
    this.userService.userBag.subscribe(bag => {this.getOrderTotal(); this.userBag = bag;})
    this.orderTotal.subscribe(orderTotal => {
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
    return bagSubtotal;
  }

  getOrderTotal(){
    const orderTotal = this.getBagSubtotal() + this.shippingEstimate.getValue();
    this.orderTotal.next(orderTotal);
    return orderTotal;
  }

  navigateToCheckout(){
    this.router.navigate(['checkout']);
  }
  navigateToShop(){
    this.router.navigate(['shop']);
  }

}
