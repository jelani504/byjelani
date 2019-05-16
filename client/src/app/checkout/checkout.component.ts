import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../user.service';
import { NavigationService } from '../navigation.service';
import { FormControl, Validators, FormGroup, NgForm } from '@angular/forms';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  public cardInfo: ElementRef;
  @ViewChild('cardInfo') set getCardInfo(cardInfo: ElementRef) {
    const checkoutPage = this;
    setTimeout(() => {
      checkoutPage.cardInfo = cardInfo;
      if (checkoutPage.cardInfo) {
        checkoutPage.card.mount(checkoutPage.cardInfo.nativeElement);
      }
    }, 0);
  }
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  public vmUserBag = [];
  public vmOrderTotal;

  public orderForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    postal_code: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    streetAddress: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),

  });

  constructor(
    private cd: ChangeDetectorRef,
    private userService: UserService,
    public navigationService: NavigationService,
    private orderService: OrderService
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

  ngAfterViewInit() {
    const style = {
      base: {
        color: '#32325d',
        lineHeight: '18px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    this.card = elements.create('card', { style });
    this.card.addEventListener('change', this.cardHandler);
    // this.card = elements.create('card');
    // this.card.mount(this.cardInfo.nativeElement);

    // this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    const { card, vmOrderTotal, orderForm } = this
    const { orderTotal } = vmOrderTotal;
    const {
      firstName,
      lastName,
      phone,
      city,
      country,
      state,
      postal_code,
      streetAddress
    } = orderForm.value;
    const { token, error } = await stripe.createToken(card);
    const shipping = {
       name: `${firstName} ${lastName}`,
       address: {
         line1: streetAddress,
         city,
         country,
         postal_code,
         state
       },
       phone,
     };
    //catch invalid form
    if (error) {
      console.log('Something is wrong:', error);
    } else {
      console.log('Success!', token, orderTotal, shipping);
      // ...send the token to the your backend to process the charge
      this.orderService.createStripeOrder(token, orderTotal * 100, shipping).subscribe(res => console.log(res));
    }

  }

  payClick(){
    console.log(this.orderForm);
  }

}
