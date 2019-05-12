import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public vmProducts = [];
  public showOrders = false;
  public showProducts = false;
  public productDisplayedColumns: String[] = ['SIZE', 'QUANTITY'];
  public paypalOrderDisplayedColumns: String[] = [
    'ORDERID',
    'ORDERTOTAL',
    'TRANSACTIONID',
    'TRANSACTIONSTATUS', 
    'SHIPPINGINFO',
    'STATUS',
    'ITEMS'
  ];
  public vmOrders = { paypalOrders: [] };

  constructor( private adminService: AdminService, private productService: ProductService) {
    productService.products.subscribe(products => {this.vmProducts = products; console.log(products)});
    adminService.orders.subscribe(orders =>{ this.vmOrders = orders})
   }

  ngOnInit() {
  }

  viewOrders(){
    this.showProducts = false;
    this.showOrders = true;
  }

  viewProducts(){
    this.showOrders = false;
    this.showProducts = true;
  }

}
