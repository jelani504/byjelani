import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router, private configService: ConfigService) { }

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
    console.log(subBrand, modelID, versionID);
    this.router.navigate(['shop', subBrand, modelID, versionID])

  }
  navigateToGoogleAuth(){
    window.location.assign(this.configService.vmGoogleLink);
  }
}
