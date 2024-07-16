import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ShopComponent } from './shop/shop.component';
import { ProductsComponent } from './products/products.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { VerifyResetCodeComponent } from './verify-reset-code/verify-reset-code.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { logedOutGuard } from './loged-out.guard';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { ChangeInformationComponent } from './change-information/change-information.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CheckoutComponent } from './checkout/checkout.component';

export const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'home',canActivate:[authGuard], component:HomeComponent},
    {path:'shop',canActivate:[authGuard], component:ShopComponent},
    {path:'products',canActivate:[authGuard], component:ProductsComponent},
    {path:'productDetails/:id',canActivate:[authGuard], component:ProductDetailsComponent},
    {path:'about',canActivate:[authGuard], component:AboutComponent},
    {path:'cart',canActivate:[authGuard], component:CartComponent},
    {path:'wishlist',canActivate:[authGuard], component:WishlistComponent},
    {path:'checkout/:id',canActivate:[authGuard], component:CheckoutComponent},
    {path:'contact',canActivate:[authGuard], component:ContactComponent},
    {
     path: 'userAccount', canActivate: [authGuard], component: UserAccountComponent, children: [
        {path:'', redirectTo:'changeInformation', pathMatch:'full'},
        {path:'changeInformation', component:ChangeInformationComponent},
        {path:'changePassword', component:ChangePasswordComponent},
    ]},
    {path:'forgetpassword',canActivate:[logedOutGuard], component:ForgetPasswordComponent},
    {path:'verifyresetcode/:email',canActivate:[logedOutGuard], component:VerifyResetCodeComponent},
    {path:'resetpassword',canActivate:[logedOutGuard], component:ResetPasswordComponent},
    {path:'login',canActivate:[logedOutGuard], component:LoginComponent},
    {path:'register',canActivate:[logedOutGuard], component:RegisterComponent},
    {path:'**', component:PageNotFoundComponent},
];
