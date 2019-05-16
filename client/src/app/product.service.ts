import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public products = new BehaviorSubject([]);
  constructor(private _http: HttpClient) {}

  getAllProducts(){
    return this._http.get('http://127.0.0.1:3000/api/products', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getProductModel(productModelID, products?){
    let queryModel;
    this.products.getValue().forEach((model )=> {      
      if(model.id === parseInt(productModelID) ){
        queryModel = model;
      }
    });
    return queryModel;
  }
  
  getProduct(productVersionID){
    let product;
    this.products.getValue().forEach((model) => {
      model.versions.forEach(version =>{
        if(version.id === parseInt(productVersionID)){
          product = version;
        }
      });
    });
    return product;
  }
}
