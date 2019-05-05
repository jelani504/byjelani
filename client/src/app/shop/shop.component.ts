import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  public vmProducts = [];
  constructor(public productService: ProductService, private navigationService: NavigationService) {
    productService.products.subscribe(products => this.vmProducts = products)
  }

  ngOnInit() {
  }
  selectProduct = (subBrand, modelID, versionID) => {
    this.navigationService.navigateToProduct(subBrand, modelID, versionID);
  }
}
