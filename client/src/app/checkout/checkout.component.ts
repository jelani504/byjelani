import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { NavigationService } from '../navigation.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public vmUserBag = [];
  public vmOrderTotal;
  public orderForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    company: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    streetAddress: new FormControl('', Validators.required),
  });

  constructor(
    private userService: UserService,
    public navigationService: NavigationService
  ) {
    userService.userBag.subscribe(bag => {this.vmUserBag = bag; console.log(this.vmUserBag, 'BAG');});
    this.userService.orderTotal.subscribe(orderTotal => {
      this.vmOrderTotal = {
        orderTotal,
        bagSubtotal: this.userService.bagSubtotal.getValue(),
        shippingEstimate: this.userService.shippingEstimate.getValue()
      };
    });
   }

  ngOnInit() {
  }

  payClick(){
    console.log(this.orderForm);
  }

}
