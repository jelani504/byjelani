import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private _http: HttpClient, private configService: ConfigService) { }

  createStripeOrder(token, amount, shipping){
    return this._http.post(`${this.configService.apiOrigin}/api/orders/create/stripe`, { token, amount, shipping } ,{
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
