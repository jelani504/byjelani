import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public isAdmin: Boolean;
  public orders = new BehaviorSubject({paypalOrders: []});

  constructor(private _http: HttpClient) {
    this.getAdminStatus().subscribe((res: {adminStatus: Boolean}) => this.isAdmin = res.adminStatus);
    this.getAllOrders().subscribe((res: {paypalOrders: []}) => {console.log(res);this.orders.next({paypalOrders: res.paypalOrders})})
   }

  getAdminStatus(){
    return this._http.get('http://127.0.0.1:3000/api/admin', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getAllOrders(){
    return this._http.get('http://127.0.0.1:3000/api/admin/orders', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

}
