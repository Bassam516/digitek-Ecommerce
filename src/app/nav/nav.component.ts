import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ProductsService } from '../products.service';
import { BadgeModule } from 'primeng/badge';
import { CartService } from '../cart.service';
import { SidebarModule } from 'primeng/sidebar';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink,NgIf,NgFor,BadgeModule,NgFor,NgIf,SidebarModule,CurrencyPipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit {
  
  isLogin: boolean = false;
  categories: any[] = [];
  cartItemsNum: number = 0;
  wishlistItemsNum: number = 0;
  sidebarVisible!: boolean ;
  cartItems: any;
  cartId: string = '';
  isLoading: boolean = true;
  cartEmpty: boolean = false;
  totalCartPrice: number = 0;

  constructor(private _AuthService: AuthService, private _ProductsService: ProductsService, private _CartService:CartService, private _ToastrService:ToastrService, private _WishlistService:WishlistService) { }
  
  ngOnInit(): void {

     this._ProductsService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    })

    this._CartService.numOfCartItems.subscribe({
      next: (value) => this.cartItemsNum = value,
      error:(err)=>console.log(err)
    })

    this._WishlistService.wishlistItemNums.subscribe({
      next: (value) => this.wishlistItemsNum = value,
      error:(err)=>console.log(err)
    })

    this._AuthService.isLogin.subscribe({
      next: () => {
        if (this._AuthService.isLogin.getValue() != null) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }
      }
    })

    this._CartService.sidebarVisible.subscribe({
      next: (value) => {
        this.sidebarVisible = value;
        if (value === true) {
          this.getCartData();
        }
      },
      error:(err)=>console.log(err)
    })

   
  }

  handleLogout() {
    this._AuthService.signOut();
  }

  getCartData() {
    this.sidebarVisible = true;
    this.isLoading = true;
    this._CartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartItems = res.data;
        this.cartId = res.data._id;
        this.totalCartPrice = res.data.totalCartPrice;
        console.log(this.cartItemsNum);
        if (this.cartItemsNum == 0) {
          this.cartEmpty = true;
        } else {
          this.cartEmpty = false;
        }
        this._CartService.numOfCartItems.next(res.numOfCartItems);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.cartEmpty = true;
      }
    })
  }
  
  handleUpdateProductCount(id: string, count: number) {
    this.isLoading = true;
    this._CartService.updateProductCount(id, count).subscribe({
      next: (res) => {
        this.cartItems = res.data;
        this.totalCartPrice = res.data.totalCartPrice;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  handleDeleteCartItem(id: string) {
    this.isLoading = true;
    this._CartService.deleteCartItem(id).subscribe({
      next: (res) => {
        this.cartItems = res.data;
        this.totalCartPrice = res.data.totalCartPrice;
        if (res.numOfCartItems === 0) {
          this.cartEmpty = true;
        }
        this._CartService.numOfCartItems.next(res.numOfCartItems);
        this._ToastrService.success('Your item deleted successfully', 'delete', {
          positionClass: 'toast-top-center'
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }


}

