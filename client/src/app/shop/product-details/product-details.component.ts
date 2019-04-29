import { Component, OnInit, Input } from '@angular/core';
import { UserbagService } from 'src/app/userbag.service';
import { SnackbarService } from 'src/app/snackbar.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  @Input() product;
  @Input() productModel;
  @Input() productSubBrand;
  public selectedSize;
  constructor(
    private userbagService: UserbagService, private snackBarService: SnackbarService
  ) {
  }

  ngOnInit() {
  }

  addToBag(){
    if(this.selectedSize){
      this.userbagService.addProductToBag(this.product, this.selectedSize);
      this.snackBarService.snackBarMessage.next('This item has been added to your bag.');
    } else {
      this.snackBarService.snackBarMessage.next('Please select a size.');
    }
  }
}
