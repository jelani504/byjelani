import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public isAdmin = new BehaviorSubject(false);
  public orders = new BehaviorSubject({paypalOrders: []});

  constructor(private _http: HttpClient, private configService: ConfigService) {
    this.getAdminStatus().subscribe((res: {adminStatus: boolean}) => this.isAdmin.next(res.adminStatus));
    this.getAllOrders().subscribe((res: {paypalOrders: []}) => {console.log(res);this.orders.next({paypalOrders: res.paypalOrders})})
   }

  getAdminStatus(){
    return this._http.get(`${this.configService.apiOrigin}/api/admin`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  updateOrderStatus(orderID, status){
    return this._http.post(`${this.configService.apiOrigin}/api/admin/orders/update`, { orderID, status }, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getAllOrders(){
    return this._http.get(`${this.configService.apiOrigin}/api/admin/orders`, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

}
