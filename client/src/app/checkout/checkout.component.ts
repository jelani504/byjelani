import { Component, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../user.service';
import { NavigationService } from '../navigation.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';

declare let paypal: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  public addScript: boolean = false;
  public vmUserBag = [];
  public vmOrderTotal;

  paypalConfig = {
    createOrder: (data, actions) => {
      const orderTotal = this.vmOrderTotal.orderTotal;
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: orderTotal
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('Transaction completed by ' + details.payer.name.given_name);
        // Call your server to save the transaction
        return fetch('http://localhost:3000/api/orders/create', {
          method: 'post',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            orderID: data.orderID
          })
        });
      });
    }
  }
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

  private intervalId;

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
      this.intervalId = setInterval(() => {
        const elementExists = !!document.getElementById('paypal-btn')
        if (elementExists) {
          if(!this.addScript){
            this.addPaypalScript().then(() => {
              paypal.Buttons(this.paypalConfig).render('#paypal-btn');
            }).catch()
          }
        }
      }, 1000)
    });
   }

  addPaypalScript(){
    clearInterval(this.intervalId);
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script');
      scripttagElement.src = "https://www.paypal.com/sdk/js?client-id=AUiqZ6DdrVYUyaPfNKFBJTca2HmUNLbxd1kZzSqtMYzGsnRIykvybflBdt1UuzeUW1F3n-R0q2J0GcXb"
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    })
  }

  payClick(){
    console.log(this.orderForm);
  }

}
