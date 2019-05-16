import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private _http: HttpClient) { }

  createStripeOrder(token, orderTotal, shippingInfo){
    return this._http.post('http://127.0.0.1:3000/api/orders/create/stripe', { token, orderTotal, shippingInfo } ,{
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
