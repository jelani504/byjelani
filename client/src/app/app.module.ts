import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HeadComponent } from './head/head.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ShopComponent } from './shop/shop.component';
import { RegisterService } from './register/register.service';
import { IconService } from './icon.service';
import { LoginService } from './login/login.service';
import { ProductDetailsComponent } from './shop/product-details/product-details.component';
import { SnackbarService } from './snackbar.service';
import { AccountComponent } from './account/account.component';
import { ShoppingBagComponent } from './shopping-bag/shopping-bag.component';
import { ProductService } from './product.service';
import { CheckoutComponent } from './checkout/checkout.component';
import { NavigationService } from './navigation.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomepageComponent,
    HeadComponent,
    SidenavComponent,
    ShopComponent,
    ProductDetailsComponent,
    AccountComponent,
    ShoppingBagComponent,
    CheckoutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule
  ],
  providers: [
    RegisterService,
    IconService,
    LoginService,
    SnackbarService,
    ProductService,
    NavigationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
