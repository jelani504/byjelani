import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { ProductService } from '../product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public vmProducts = [];
  public showOrders = false;
  public vmIsAdmin = false;
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
  public updateOrderForm: FormGroup = new FormGroup({
    updateOrderID: new FormControl(null, [Validators.required]),
    updateOrderStatus: new FormControl(null, Validators.required),
  });

  constructor( private adminService: AdminService, private productService: ProductService) {
    adminService.isAdmin.subscribe(status => this.vmIsAdmin = status)
    productService.products.subscribe(products => {this.vmProducts = products; console.log(products)});
    adminService.orders.subscribe(orders =>{ this.vmOrders = orders})
   }

  ngOnInit() {
  }

  viewOrders(){
    this.showProducts = false;
    this.showOrders = true;
  }

  updateOrderStatus(){
    const { updateOrderID, updateOrderStatus } = this.updateOrderForm.value;
    this.adminService.updateOrderStatus(updateOrderID, updateOrderStatus).subscribe(res => console.log(res))
  }

  viewProducts(){
    this.showOrders = false;
    this.showProducts = true;
  }

}
