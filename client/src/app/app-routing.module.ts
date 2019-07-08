import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AccountComponent } from './account/account.component';
import { ShopComponent } from './shop/shop.component';
import { ShoppingBagComponent } from './shopping-bag/shopping-bag.component';
import { ProductDetailsComponent } from './shop/product-details/product-details.component';
import { AdminComponent } from './admin/admin.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PreorderComponent } from './preorder/preorder.component';

const routes: Routes = [
  // { path: '', component: PreorderComponent, pathMatch: 'full'},
  // {path: '404', component: NotFoundComponent},
  //  {path: '**', redirectTo: '/'}
  { path: '', component: HomepageComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'account', component: AccountComponent },
  {path: 'shop', component: ShopComponent },
  {path: 'shopping-bag', component: ShoppingBagComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'shop/:productSubBrand/:productModelID/:modelVersionID', component: ProductDetailsComponent },
  {path: 'admin', component: AdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
