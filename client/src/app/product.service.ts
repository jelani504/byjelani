import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public products = [];
  constructor(public _http: HttpClient) {
    this.getAllProducts().subscribe((res: {products: []}) => {console.log(res); this.products = res.products} );
   }

  getAllProducts(){
    return this._http.get('http://127.0.0.1:3000/api/products', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getProductModel(productModelID){
    let queryModel;
    this.products.forEach(model => {      
      if(model.id === parseInt(productModelID) ){
        queryModel = model;
      }
    });
    console.log(queryModel);
    return queryModel;
  }
  
  getProduct(productVersionID){
    let product;
    this.products.forEach(model => {
      model.versions.forEach(version=>{
        if(version.id === parseInt(productVersionID)){
          product = version;
        }
      });
    });
    return product;
  }
}
