import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../user.service';
import { NavigationService } from '../navigation.service';
import { FormControl, Validators, FormGroup, NgForm } from '@angular/forms';
import { OrderService } from '../order.service';
import { SnackbarService } from '../snackbar.service';
import { CheckoutService } from './checkout.service';
import { BehaviorSubject } from 'rxjs';

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
  public vmUser;
  public vmUserBag = [];
  public vmOrderTotal;
  public vmSelectedCountry = new BehaviorSubject({states: []});

  public orderForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    postal_code: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    streetAddress: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required)
  });

  constructor(
    private cd: ChangeDetectorRef,
    private userService: UserService,
    public navigationService: NavigationService,
    private orderService: OrderService,
    private snackbarService: SnackbarService,
    public checkoutService: CheckoutService
  ) {
    this.orderForm.get('country').valueChanges.subscribe(val => this.vmSelectedCountry = val);
    this.vmUser = this.userService.user.getValue();
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
    //catch invalid form
    if(firstName === '' ){ return this.snackbarService.snackBarMessage.next('FIRST NAME REQUIRED');}
    if(lastName === '' ){ return this.snackbarService.snackBarMessage.next('LAST NAME REQUIRED');}
    if(phone === '' ){ return this.snackbarService.snackBarMessage.next('PHONE NUMBER REQUIRED');}
    if(city === '' ){ return this.snackbarService.snackBarMessage.next('CITY REQUIRED');}
    if(country === '' ){ return this.snackbarService.snackBarMessage.next('COUNTRY REQUIRED');}
    if(state === '' ){ return this.snackbarService.snackBarMessage.next('STATE REQUIRED');}
    if(streetAddress === '' ){ return this.snackbarService.snackBarMessage.next('STREET ADDRESS REQUIRED');}
    if(postal_code === '' ){ return this.snackbarService.snackBarMessage.next('ZIP OR POSTAL CODE REQUIRED');}
    const { token, error } = await stripe.createToken(card);
    const shipping = {
       name: `${firstName} ${lastName}`,
       address: {
         line1: streetAddress,
         city,
         country: country.name,
         postal_code,
         state: state.code
       },
       phone,
     };
    if (error) {
      console.log('Something is wrong:', error);
      this.snackbarService.snackBarMessage.next(`Something is wrong: ${error.message}`);
      return;

    } else {
      console.log('Success!', token, orderTotal, shipping);
      this.snackbarService.snackBarMessage.next('Success!');
      // ...send the token to the your backend to process the charge
      this.orderService.createStripeOrder(token, orderTotal * 100, shipping).subscribe(res => this.navigationService.navigateHome());
    }

  }

  payClick(){
    console.log(this.orderForm);
  }

}
