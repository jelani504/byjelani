import { Component, OnInit, Input } from '@angular/core';
import { SnackbarService } from 'src/app/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/product.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  @Input() product;
  @Input() productModel;
  public selectedSize;
  constructor(
    private userService: UserService,
    private snackBarService: SnackbarService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe( params => {
      const { modelVersionID, productModelID, productSubBrand } = params;
      const productModel = this.productService.getProductModel(productModelID);
      if(productModel.subBrand.split(' ').join('') === productSubBrand){
        this.productModel = productModel;
        this.product = this.productService.getProduct(modelVersionID);
      }
    });
  }

  navigateToShop(){
    this.router.navigate(['shop'])
  }

  addToBag(){
    if(this.selectedSize){
      this.userService.addProductToBag(this.product, this.selectedSize);
      this.snackBarService.snackBarMessage.next('This item has been added to your bag.');
    } else {
      this.snackBarService.snackBarMessage.next('Please select a size.');
    }
  }
}
