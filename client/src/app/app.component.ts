import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SnackbarService } from './snackbar.service';
import { ProductService } from './product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private snackBar: MatSnackBar,
    private snackbarService: SnackbarService,
    private productService: ProductService
  ){
    snackbarService.snackBarMessage.subscribe( message => {
      if(message){
        snackBar.open(message, '', {
          duration: 5000, verticalPosition: "top", panelClass: 'center'
        });
      }
    });
    productService.getAllProducts().subscribe((res: {products: []}) => { productService.products.next(res.products)} );
  }
  title = 'client';
}
