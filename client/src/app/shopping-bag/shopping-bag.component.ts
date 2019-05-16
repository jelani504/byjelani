import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { NavigationService } from '../navigation.service';
import { environment as devEnv} from '../../environments/environment';
import { environment as prodEnv } from '../../environments/environment.prod';
import { PromocodeService } from '../promocode.service';
import { ThrowStmt } from '@angular/compiler';

declare let paypal: any;

@Component({
  selector: 'app-shopping-bag',
  templateUrl: './shopping-bag.component.html',
  styleUrls: ['./shopping-bag.component.scss']
})
export class ShoppingBagComponent implements OnInit {

  private intervalId;
  private paypalConfig;
  private paypalClientID;
  public addScript: boolean = false;
  public userBag: any[];
  public displayedColumns: String[] = ['ITEM', 'PRICE', 'QUANTITY'];
  public vmOrderTotal;
  public appliedPromo;
  public vmCheckoutOption = {paypal: false}

  constructor(
    private userService: UserService,
    public navigationService: NavigationService,
    public promocodeService: PromocodeService
  ) {
    if(prodEnv.production){
      this.paypalClientID = prodEnv.paypalClientID;
    } else {
      this.paypalClientID = devEnv.paypalClientID;
    }
    this.userService.userBag.subscribe(
      bag => {console.log(this.userBag); this.userBag = bag}
    );
    this.userService.orderTotal.subscribe(orderTotal => {
      this.vmOrderTotal = {
        orderTotal,
        bagSubtotal: this.userService.bagSubtotal.getValue(),
        shippingEstimate: this.userService.shippingEstimate.getValue()
      };
      this.paypalConfig = {
        createOrder: (data, actions) => {
          const orderTotal = this.vmOrderTotal.orderTotal;
          return actions.order.create({
            purchase_units: [
                {
                amount: {
                  value: orderTotal
                }
              }
            ]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            alert('Transaction completed by ' + details.payer.name.given_name);
            // Call your server to save the transaction
            return fetch('http://localhost:3000/api/orders/create/paypal', {
              method: 'post',
              headers: {
                'content-type': 'application/json'
              },
              body: JSON.stringify({
                orderID: data.orderID,
                orderTotal: this.vmOrderTotal.orderTotal,
                userBag: this.userBag,
                email: this.userService.user.getValue().email
              })
            }).then(res => console.log(res)).catch(err => console.log(err));
          });
        }
      }
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
    this.promocodeService.appliedPromo.subscribe(appliedPromo => this.appliedPromo = appliedPromo)
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

  onPromoCodeType(code){
    this.promocodeService.promoCodeUpdated.next(code);
  }

  showPaypalButton(){ this.vmCheckoutOption.paypal = !this.vmCheckoutOption.paypal}

  ngOnInit() {
    this.userService.getOrderTotal();
  }



}
