import { Component, OnInit, Input, Inject } from '@angular/core';
import { SnackbarService } from 'src/app/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/product.service';
import { UserService } from 'src/app/user.service';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  //product Version
  @Input() product;
  @Input() productModel;
  public selectedSize;
  public vmBagButtonStr;
  public isItemInBag;
  private addOneMoreStr = 'ADD ONE MORE';

  constructor(
    private userService: UserService,
    private snackBarService: SnackbarService,
    private route: ActivatedRoute,
    private productService: ProductService,
    public navigationService: NavigationService,
  ) {}

  ngOnInit() {
    this.setCartButtons();
    this.route.params.subscribe( params => {
      this.productService.products.subscribe(products => {
        if(products.length > 0){
          const { modelVersionID, productModelID, productSubBrand } = params;
          const productModel = this.productService.getProductModel(productModelID);
          if(productModel){
            if(productModel.subBrand.split(' ').join('') === productSubBrand){
              this.productModel = productModel;
              this.product = this.productService.getProduct(modelVersionID);
            }
          }
        }
      });
    });
  }


  setCartButtons(){
    if(this.userService.isItemInBag(this.product)){
      this.vmBagButtonStr = this.addOneMoreStr;
      this.isItemInBag = true;
    } else {
      this.isItemInBag = false;
      this.vmBagButtonStr = 'ADD TO BAG';
    }
  }

 
  addToBag(){
    const user = this.userService.user.getValue();
    if(user.email){
      if(this.selectedSize){
        this.userService.addProductToBag(this.product, this.selectedSize, this.productModel.id);
        this.snackBarService.snackBarMessage.next('This item has been added to your bag.');
        if(!this.isItemInBag){
          this.isItemInBag = true;
          this.vmBagButtonStr = this.addOneMoreStr;
        }
      } else {
        this.snackBarService.snackBarMessage.next('Please select a size.');
      }
    } else {
      this.userService.openDialog('You must be signed in to add to bag.');
    }

  }
}

