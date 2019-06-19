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
  @Input() version;
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
              this.version = this.productService.getProduct(modelVersionID);
            }
          }
        }
      });
    });
  }


  setCartButtons(){
    if(this.userService.isItemInBag(this.version)){
      this.vmBagButtonStr = this.addOneMoreStr;
      this.isItemInBag = true;
    } else {
      this.isItemInBag = false;
      this.vmBagButtonStr = 'ADD TO BAG';
    }
  }

  completeAddToBag(){
    this.snackBarService.snackBarMessage.next('This item has been added to your bag.');
    if(!this.isItemInBag){
      this.isItemInBag = true;
      this.vmBagButtonStr = this.addOneMoreStr;
    }
  }

  addToBag(){
    const { selectedSize, version, snackBarService, userService, productModel, completeAddToBag } = this;
    const user = this.userService.user.getValue();
    console.log(user);
    if(selectedSize){
      if(user.email){
        userService.addProductToBag(version, selectedSize, productModel.id);
        this.completeAddToBag();
      } else {
        userService.addProductToSessBag(version, selectedSize, productModel.id);
        this.completeAddToBag();
      }
    } else {
      snackBarService.snackBarMessage.next('Please select a size.');
    }
  }
}

