import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  handleIconClick(icon){
    this.router.navigate([`/${icon}`]);
  }

  navigateToShop(){
    this.router.navigate(['shop']);
  }

  navigateToShoppingBag(){
    this.router.navigate(['shopping-bag']);
  }

  navigateHome(){
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToCheckout(){
    this.router.navigate(['checkout']);
  }

  navigateToProduct(subBrand, modelID, versionID){
    this.router.navigate(['shop', subBrand, modelID, versionID])

  }
}
