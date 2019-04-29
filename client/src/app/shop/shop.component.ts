import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  constructor(public productService: ProductService, private router: Router) { }

  ngOnInit() {
  }
  selectProduct = (versionID, modelID, subBrand) => {
    this.router.navigate(['shop', subBrand, modelID, versionID])
  }
}
