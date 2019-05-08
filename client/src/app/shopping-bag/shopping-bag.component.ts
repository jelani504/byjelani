import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { NavigationService } from '../navigation.service';
import { environment as devEnv} from '../../environments/environment';
import { environment as prodEnv } from '../../environments/environment.prod';

declare let paypal: any;

@Component({
  selector: 'app-shopping-bag',
  templateUrl: './shopping-bag.component.html',
  styleUrls: ['./shopping-bag.component.scss']
})
export class ShoppingBagComponent implements OnInit {

  public addScript: boolean = false;
  private intervalId;
  private paypalConfig = {
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

  public userBag: any[];
  public displayedColumns: String[] = ['ITEM', 'PRICE', 'QUANTITY'];
  public vmOrderTotal;
  private paypalClientID;
  constructor(private userService: UserService ,public navigationService: NavigationService) {
    if(prodEnv.production){
      this.paypalClientID = prodEnv.paypalClientID;
    } else {
      this.paypalClientID = devEnv.paypalClientID;
    }
    this.userService.userBag.subscribe(bag => {this.userBag = bag;})
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
      }, 1000);
    });
  }

  addPaypalScript(){
    clearInterval(this.intervalId);
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script');
      scripttagElement.src = `https://www.paypal.com/sdk/js?client-id=${this.paypalClientID}`
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    })
  }

  ngOnInit() {
    this.userService.getOrderTotal();
  }



}
