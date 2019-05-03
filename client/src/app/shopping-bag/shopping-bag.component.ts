import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-shopping-bag',
  templateUrl: './shopping-bag.component.html',
  styleUrls: ['./shopping-bag.component.scss']
})
export class ShoppingBagComponent implements OnInit {

  public userBag: any[] = [];
  public displayedColumns: String[] = ['ITEM', 'PRICE', 'QUANTITY'];
  public vmOrderTotal;

  constructor(private userService: UserService ,public navigationService: NavigationService) {
    this.userService.userBag.subscribe(bag => {this.userService.getOrderTotal(); this.userBag = bag;})
    this.userService.orderTotal.subscribe(orderTotal => {
      this.vmOrderTotal = {
        orderTotal,
        bagSubtotal: this.userService.bagSubtotal.getValue(),
        shippingEstimate: this.userService.shippingEstimate.getValue()
      };
    });
  }

  ngOnInit() {
    this.userService.getOrderTotal();
  }



}
