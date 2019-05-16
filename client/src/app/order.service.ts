import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private _http: HttpClient) { }

  createStripeOrder(token, amount, shipping){
    return this._http.post('http://127.0.0.1:3000/api/orders/create/stripe', { token, amount, shipping } ,{
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
