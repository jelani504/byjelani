import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../user.service';
import { NavigationService } from '../navigation.service';
import { FormControl, Validators, FormGroup, NgForm } from '@angular/forms';

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
    company: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    streetAddress: new FormControl('', Validators.required),
  });

  constructor(
    private cd: ChangeDetectorRef,
    private userService: UserService,
    public navigationService: NavigationService,
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
    const { token, error } = await stripe.createToken(card);
    //catch invalid form
    if (error) {
      console.log('Something is wrong:', error);
    } else {
      console.log('Success!', token, orderTotal, orderForm.value);
      // ...send the token to the your backend to process the charge
    }
  }

  payClick(){
    console.log(this.orderForm);
  }

}
